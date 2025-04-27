import { defineConfig } from 'vitest/config';

const extensions = {
  es: 'mjs',
  cjs: 'cjs',
  umd: 'js'
};

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    sourcemap: true,
    lib: {
      entry: './src/index.ts',
      name: 'quadHexer',
      fileName: (format: string) => `quad-hexer.${extensions[format]}`,
      formats: ['es', 'cjs', 'umd']
    }
  },
  test: {
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts']
    }
  }
});
