import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),     
    tailwindcss()
],
  server: {
    allowedHosts: ["a4c4d2f8d8c8.ngrok-free.app"],
    proxy: {
      "/api": "https://sih2025-backend-syn-sup.vercel.app",
      "/products": "http://localhost:3000",
      "/events": "http://localhost:3000"
    }
  }
})
