import { Options, RawOptions } from "./types";
import path from "path";

const defaultOptions = {
  dir: "api",
  tempDir: ".temp",
  cwd: process.cwd(),
  /** api file format */
  fileFormat: "cjs,mjs,js,ts,json",
  fileFormatExcludeJson: [".cjs", ".mjs", ".js", ".ts"],
};

function setFileFormatExcludeJson(fileFormat: string): string[] {
  return fileFormat
    .split(",")
    .reduce((previousValue: string[], currentValue: string) => {
      return currentValue === "json"
        ? [...previousValue]
        : [...previousValue, `.${currentValue}`];
    }, []);
}

export function setOptions(argv: RawOptions, root: string): Options {
  const options = Object.assign({}, defaultOptions, argv) as Options;
  options.dirPath = path.join(root, options.dir);
  options.tempDirPath = path.join(
    root,
    "node_modules",
    "vite-plugin-dev-server-api",
    options.tempDir
  );
  options.fileFormatExcludeJson = setFileFormatExcludeJson(options.fileFormat);

  return options;
}
