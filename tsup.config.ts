import { defineConfig } from 'tsup';

const commonConfig = {
  entry: ['src/index.ts'],
  dts: true,
  sourcemap: false,
  splitting: false,
  treeshake: true,
  minify: true,
  outExtension() {
    return {
      js: '.js',
    };
  },
};

// tsup outputs to flat structure, so we need separate configs for cjs and esm
// to match the current lib/cjs/ and lib/esm/ structure
export default [
  // CJS build
  defineConfig({
    ...commonConfig,
    format: ['cjs'],
    outDir: 'lib/cjs',
    // Suppress warning about named and default exports
    banner: {
      js: '"use strict";',
    },
  }),
  // ESM build
  defineConfig({
    ...commonConfig,
    format: ['esm'],
    outDir: 'lib/esm',
  }),
];
