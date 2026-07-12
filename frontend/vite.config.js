import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL("./src", import.meta.url)),
      "@shared": fileURLToPath(new URL("../shared", import.meta.url))
    }
  } ,
  server: {
    host: "0.0.0.0",
    allowedHosts: [
      "frontend.192.168.1.135.sslip.io"
    ],
    proxy: {
      "/api": {
        target: "http://192.168.1.135:3000",
        changeOrigin: true,
      },
    },
  },
})