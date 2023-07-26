# vite-plugin-dev-server-api

Configure custom api(action and retrun) for vite dev server

## Use

```ts
// vite.config.ts
import devServerApi from "vite-plugin-dev-server-api";

export default {
  // ...

  plugins: [
    // ...,
    devServerApi(options?: {}),
  ],

  // ...
};
```

```ts
// api/index.ts
import fs from "fs/promise";

export default {
  "/dev/server/api/json/data": async function () {
    // You can call all the node.js capabilities here
    let ctn = await fs.readFile("../json/data.json", { encoding: "utf-8" });
    return ctn;
  },
};
```

```ts
axios.get("/dev/server/api/json/data").then((res) => {
  console.log(res); // json/data.json content
});
```

## Features

- [x] Auto import api form `options.dir`(default: `api`).
- [x] Support `.js|.cjs|.mjs|.ts|json` file in `options.dir`. (with default export, eg: `export default/module.exports`)
- [x] Full TypeScript support.
- [ ] duplicate addresses prompt
