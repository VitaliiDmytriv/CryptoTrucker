import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueDevTools from "vite-plugin-vue-devtools";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    AutoImport({
      imports: ["vue", "vue-router"],
      dts: "src/auto-imports.d.ts",
      dirs: ["src/composables", "src/stores", "src/helpers"],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
      },
    }),
    Components({
      dirs: ["src/components", "src/layout", "src/views"],
      extensions: ["vue"],
      deep: true,
      dts: "src/components.d.ts",
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:3001", // Adjust the target to your backend server
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    open: true,
  },
});
