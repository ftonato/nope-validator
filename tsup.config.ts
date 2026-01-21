import { defineConfig } from 'tsup';

// tsup outputs to flat structure, so we need separate configs for cjs and esm
// to match the current lib/cjs/ and lib/esm/ structure
export default [
  // CJS build
  defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs'],
    dts: true,
    sourcemap: true,
    splitting: false,
    treeshake: true,
    minify: false,
    outDir: 'lib/cjs',
    outExtension() {
      return {
        js: '.js',
      };
    },
    // Suppress warning about named and default exports
    banner: {
      js: '"use strict";',
    },
  }),
  // ESM build
  defineConfig({
    entry: ['src/index.ts'],
    format: ['esm'],
    dts: false, // Only generate types once (from CJS build)
    sourcemap: true,
    splitting: false,
    treeshake: true,
    minify: false,
    outDir: 'lib/esm',
    outExtension() {
      return {
        js: '.js',
      };
    },
  }),
];
