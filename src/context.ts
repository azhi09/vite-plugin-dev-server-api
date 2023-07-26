import { setOptions } from "./options";
import {
  ApiMapUrl,
  ApiMapUrlValue,
  ApiReturnBase,
  Options,
  RawOptions,
  PkgType,
} from "./types";
import path from "path";
import fs from "fs/promises";
import { rimraf } from "rimraf";
import FastGlob from "fast-glob";
import {
  isFunction,
  resolveApi,
  resolveJsonFile,
  resolveTsFile,
} from "./utils";

export class Context {
  options: Options;
  root = process.cwd();

  constructor(private rawOptions: RawOptions = {}) {
    const { cwd } = rawOptions;

    if (cwd) {
      this.root = cwd;
    }

    this.options = setOptions(rawOptions, this.root);
  }

  async setTempDir() {
    const { tempDirPath } = this.options;

    try {
      await fs.access(tempDirPath);
      await rimraf(tempDirPath);
      await fs.mkdir(tempDirPath);
    } catch (e) {
      await fs.mkdir(tempDirPath);
    }
  }

  async isEsm() {
    const pkg = await fs.readFile(path.join(this.root, "package.json"), {
        encoding: "utf-8",
      }),
      pkgType: PkgType = JSON.parse(pkg).type || "commonjs";
    return "module" === pkgType;
  }

  async findApiMap(): Promise<ApiMapUrl> {
    const filePaths: string[] = await FastGlob(
      `./**/*.{${this.options.fileFormat}}`,
      {
        cwd: this.options.dirPath,
        absolute: true,
      }
    );
    const isEsm = await this.isEsm();
    let res = {};

    for (const filePath of filePaths) {
      const extname = path.extname(filePath),
        code = await fs.readFile(filePath, { encoding: "utf-8" });

      switch (extname) {
        case ".json":
          res = { ...res, ...resolveJsonFile(code, filePath) };
          break;

        case ".js":
        case ".cjs":
        case ".mjs":
        case ".ts":
          res = {
            ...res,
            ...(await resolveTsFile(
              code,
              filePath,
              this.options.tempDirPath,
              isEsm
            )),
          };
          break;

        default:
          break;
      }
    }

    return res;
  }

  async apiToApiMap(): Promise<ApiMapUrl> {
    return await resolveApi(this.options.api);
  }

  async getApiMapUrl(): Promise<ApiMapUrl> {
    await this.setTempDir();

    return {
      ...(await this.findApiMap()),
      ...(await this.apiToApiMap()),
    };
  }

  async getApiResult(
    url: string,
    apiMapUrlValue: ApiMapUrlValue
  ): Promise<ApiReturnBase> {
    const { type: apiType, path, code } = apiMapUrlValue;
    const isFn = apiType === "function";

    let content, parseContent, result;

    /** 文件 / code */
    if (code) {
      content = code;
    } else {
      const importCtn = await import(path as string);

      content = importCtn.default;
    }

    if (isFn) {
      parseContent = await content();
    } else {
      parseContent = content;
    }

    const urlContent = parseContent[url];

    if (isFunction(urlContent)) {
      result = await urlContent();
    } else {
      result = urlContent;
    }

    return result;
  }
}
