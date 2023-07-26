import { Api, ApiMapUrl, RawOptions } from "./types";
import fs from "fs/promises";
import path from "path";
import { transformWithEsbuild } from "vite";

export function isFunction(fn: unknown): fn is () => unknown {
  return typeof fn === "function";
}

export function resolveJsonFile(code: string, filePath: string): ApiMapUrl {
  let ctn;
  try {
    ctn = JSON.parse(code);
  } catch (e) {
    console.error(`${filePath} parse error.`);
    ctn = {};
  }

  return reduceJson(ctn, filePath);
}

export function reduceJson(ctn: object, filePath: string): ApiMapUrl {
  return Object.keys(ctn).reduce(
    (previousValue: ApiMapUrl, currentValue: string) => {
      const res = previousValue;
      res[currentValue] = {
        type: "json",
        path: filePath,
      };
      return res;
    },
    {}
  );
}

export async function resolveTsFile(
  code: string,
  filePath: string,
  tempDirPath: string,
  isEsm: boolean
): Promise<ApiMapUrl> {
  const { code: transformCodeResultCode } = await transformCode(
    code,
    filePath,
    isEsm
  );
  let res = {};
  if (transformCodeResultCode) {
    const transformCodeResultFilePath = path.join(
      tempDirPath,
      `${Date.now()}.${isEsm ? "mjs" : "js"}`
    );

    await fs.writeFile(transformCodeResultFilePath, transformCodeResultCode);

    const fileCode = await import(transformCodeResultFilePath),
      fileCodeIsFunction = isFunction(fileCode.default);

    let ctn = {};

    if (fileCode.default) {
      if (fileCodeIsFunction) {
        ctn = await fileCode.default();
      } else {
        ctn = fileCode.default;
      }
    } else {
      console.error(`${filePath} default module not found.`);
    }
    res = reduceTs(ctn, transformCodeResultFilePath, fileCodeIsFunction);
  }

  return res;
}

export async function transformCode(
  code: string,
  filePath: string,
  isEsm: boolean
): Promise<{ code: string }> {
  let result;
  try {
    result = await transformWithEsbuild(code, filePath, {
      format: isEsm ? "esm" : "cjs",
    });
  } catch {
    console.error(`${filePath} parse error`);
    result = { code: "" };
  }

  return result;
}

export async function reduceTs(ctn: object, filePath: string, isFn: boolean) {
  return Object.keys(ctn).reduce(
    (previousValue: ApiMapUrl, currentValue: string) => {
      const res = previousValue;
      res[currentValue] = {
        type: isFn ? "function" : "object",
        path: filePath,
      };
      return res;
    },
    {}
  );
}

export async function resolveApi(
  api: Required<RawOptions["api"]>
): Promise<ApiMapUrl> {
  let ctn: Api = {};
  if (isFunction(api)) {
    ctn = (await api()) as Api;
  } else {
    ctn = api as Api;
  }
  return ctn ? reduceApi(ctn) : {};
}

export function reduceApi(ctn: Api): ApiMapUrl {
  return Object.keys(ctn).reduce(
    (previousValue: ApiMapUrl, currentValue: string) => {
      const res = previousValue;
      res[currentValue] = {
        type: isFunction(ctn[currentValue]) ? "function" : "object",
        code: ctn[currentValue],
      };

      return res;
    },
    {}
  );
}
