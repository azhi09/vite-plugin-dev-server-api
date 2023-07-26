import { FilterPattern } from "vite";

export type ApiFunction = () => ApiReturnBase | Promise<() => ApiReturnBase>;

export type ApiReturnBase = object | string | number | boolean;
export type ApiReturn = ApiFunction | ApiReturnBase;

export type Api = {
  [url: string]: ApiReturn;
};

export type ApiMapUrlValue = {
  type: "json" | "object" | "function";
  path?: string;
  code?: ApiReturn;
};

/** url与文件的对应关系 */
export type ApiMapUrl = {
  [url: string]: ApiMapUrlValue;
};

export type PkgType = "commonjs" | "module";

export interface RawOptions {
  include?: FilterPattern;
  exclude?: FilterPattern;
  api?: Api | (() => Api) | (() => Promise<Api>);
  dir?: string;
  tempDir?: string;
  cwd?: string;
  fileFormat?: string;
  fileFormatExcludeJson?: string[];
}

export type Options = Omit<
  Required<RawOptions>,
  "dir" | "tempDir" | "cwd" | "fileFormat" | "fileFormatExcludeJson"
> & {
  dir: string;
  dirPath: string;
  tempDir: string;
  tempDirPath: string;
  cwd: string;
  fileFormat: string;
  fileFormatExcludeJson: string[];
};
