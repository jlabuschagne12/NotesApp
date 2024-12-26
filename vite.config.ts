/// <reference types="vitest/config" />

import path from "path"
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // @ts-expect-error: Vitest-specific config
  test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/vitest.setup.ts'
  }
})
