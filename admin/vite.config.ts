import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,
    allowedHosts: [
      "admin.192.168.1.135.sslip.io",
    ],
  },
});