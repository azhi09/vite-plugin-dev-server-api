import { describe, expect, it } from "vitest";
import { Context } from "../src/context";
import path from "path";

const api = {
  "/api/test/object": { data: "object" },
  "/api/test/function": () => ({
    data: "object",
  }),
  "api/test/promiseFunction": () =>
    new Promise((res) => {
      setTimeout(() => {
        res({ data: "Promise<object>" });
      }, 3 * 1000);
    }),
};

describe("api", () => {
  it("find api", async () => {
    const cwd = path.join(process.cwd(), "examples/vite-vue/");

    const ctx = new Context({ cwd });

    const apiMapUrl = await ctx.findApiMap();

    // expect(apiMapUrl).toMatchSnapshot();
  });

  it("api to apiMap", async () => {
    const ctx = new Context({ api });
    const ctxApiMapUrl = await ctx.apiToApiMap();

    expect(ctxApiMapUrl).toMatchSnapshot();
  });
});
