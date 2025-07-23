import path from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
  resolve: {
    alias: {
      '@utils-core': path.resolve(__dirname, 'src/utils/index.ts'),
      // add other aliases as needed
    },
  },
});
