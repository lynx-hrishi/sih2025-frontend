import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),     
    tailwindcss()
],
  server: {
    allowedHosts: ["12f2fceccab1.ngrok-free.app"],
    proxy: {
      "/api": "https://tone-bring-grill-fcc.trycloudflare.com",
      "/products": "http://localhost:3000",
      "/events": "http://localhost:3000"
    }
  }
})
