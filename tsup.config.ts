import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    dts: false,
    clean: false,
    shims: true,
    banner: { js: '#!/usr/bin/env node' },
    outExtension: () => ({ js: '.mjs' }),
    esbuildOptions(options) {
      options.jsx = 'automatic';
    },
  },
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: false,
    shims: true,
  },
]);
