import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: ['all'],
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:4003',
        changeOrigin: true,
      },
    },
  },
})
