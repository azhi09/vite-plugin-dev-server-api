import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import devServerApi from "vite-plugin-dev-server-api";

// https://vitejs.dev/config/
export default defineConfig(async () => {
  return {
    plugins: [vue(), devServerApi()],
  };
});
