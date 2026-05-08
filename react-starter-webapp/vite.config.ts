import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
import tailwindcss from '@tailwindcss/vite'

dotenv.config()

const clientPort = String(process.env['VITE_CLIENT_PORT'])

const basePath = process.env[`DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`]
  ? String(process.env[`DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`]) + '/'
  : ''

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: Number(clientPort),
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${process.env['VITE_API_PORT']}`,
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [tailwindcss(), react()],
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base: basePath,
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: () => 'index', // Force everything into a single chunk
      },
    },
  },
})
