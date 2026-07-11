import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/site-api': 'http://localhost:3000',
      '/sitedata.json': 'http://localhost:3000',
    },
  },
})
