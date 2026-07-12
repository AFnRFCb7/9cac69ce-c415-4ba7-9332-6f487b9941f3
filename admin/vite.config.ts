import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    allowedHosts: [
      "admin.192.168.1.135.sslip.io",
      "frontend.192.168.1.135.sslip.io"
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared", import.meta.url))
    }
  }
});