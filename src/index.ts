import type { Plugin, ViteDevServer } from "vite";
// import DEBUG from "debug";
import { ApiMapUrl, ApiReturnBase, RawOptions } from "./types";
import { Context } from "./context";

async function devServerApi(argv: RawOptions = {}): Promise<Plugin> {
  const ctx = new Context(argv);

  let apiMapUrl: ApiMapUrl = await ctx.getApiMapUrl();

  return {
    name: "vite-plugin-dev-server-api",

    configureServer(server: ViteDevServer) {
      server.middlewares.use(async (req, res, next) => {
        const { url } = req;
        let result: ApiReturnBase = {
          message: `[${url}] not found.`,
        };

        if (url && url in apiMapUrl) {
          result = await ctx.getApiResult(url, apiMapUrl[url]);

          res.end(JSON.stringify(result));
        } else {
          next();
        }
      });

      server.watcher.on("all", async (evt, path) => {
        const { dirPath } = ctx.options;

        if (path.startsWith(dirPath)) {

          apiMapUrl = await ctx.getApiMapUrl();
        }
      });
    },
  };
}

export default devServerApi;
