import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3003,
    open: true,
    headers: {
      // Allow iframe embedding for Teams tab
      "X-Frame-Options": "ALLOWALL",
    },
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
})
