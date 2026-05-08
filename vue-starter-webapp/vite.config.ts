import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv';
import tailwindcss from '@tailwindcss/vite'

dotenv.config();

const clientPort = String(process.env['VITE_CLIENT_PORT']);

const basePath = process.env[`DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`]
? String(process.env[`DKU_CODE_STUDIO_BROWSER_PATH_${clientPort}`]) + "/"
: "";

export default defineConfig({
  server: {
    host: "127.0.0.1",
    port: Number(clientPort),
    // Local-only proxy: forward /api to backend dev server
    proxy: {
      '/api': {
        target: `http://127.0.0.1:${process.env['VITE_API_PORT']}`,
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Place Tailwind plugin first so it can transform CSS before Vue
  plugins: [tailwindcss(), vue()],
  // Ensure CSS source maps are available to plugins that expect it
  css: {
    devSourcemap: true,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  base: basePath,
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        manualChunks: () => 'index' // Force everything into a single chunk
      }
    }
  }
})
