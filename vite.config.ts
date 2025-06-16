import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// Only apply base when building for production
export default defineConfig(({ command }) => ({
  plugins: [vue()],
  base: command === 'build' ? '/' : '', // use '' for dev
  server: {
    port: 5173,
    open: true,
    strictPort: true,
  }
}))
