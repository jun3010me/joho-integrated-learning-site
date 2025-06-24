import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['jquery']
        }
      }
    }
  },
  server: {
    host: true,
    port: 3000
  }
})