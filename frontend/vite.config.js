import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
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