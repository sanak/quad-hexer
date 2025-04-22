import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  root: './demo',
  base: '/quad-hexer/',
  server: {
    open: true
  },
  preview: {
    open: true
  }
});
