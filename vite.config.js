import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ShowOff/', // GitHub Pages base path
  server: {
    host: true // Expose to network for phone testing
  }
})
