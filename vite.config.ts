import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      name: 'quadHexer',
      fileName: (format: string) => `quad-hexer.${format}.js`,
      formats: ['es', 'cjs', 'umd']
    }
  }
});
