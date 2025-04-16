import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './demo',
  base: '/quad-hexer/',
  server: {
    open: true
  },
  build: {
    outDir: '../dist-demo'
  },
  preview: {
    open: true
  }
});
