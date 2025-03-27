import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";

export default defineConfig({
  plugins: [
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) =>
            ["ng-uui-oas", "ng-uui-notioas"].includes(tag),
        },
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Define el alias "@"
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
  },
  server: {
    port: 4200  // Cambia 3001 por el puerto que necesites
  }
});
