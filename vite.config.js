import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),     
    tailwindcss()
],
  server: {
    allowedHosts: ["a4d499f65bdf.ngrok-free.app"],
    proxy: {
      "/api": "https://pump-cloud-kyle-joined.trycloudflare.com",
      "/products": "http://localhost:3000",
      "/events": "http://localhost:3000"
    }
  }
})
