//#!/usr/bin/env node

// import fs from "fs/promises";
// import path from "path";
// import type { Api } from "vite-plugin-dev-server-api";

export default function apiTs() {
  return {
    "/dev/server/api/ts/export/default": function () {
      let ctn = "ts - export -default";
      return ctn;
    },
  };
}
