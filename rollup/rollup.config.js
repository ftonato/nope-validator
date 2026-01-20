import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const pkg = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf-8'));

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

export function createRollupConfig({
  name,
  format,
  tsconfigOverride,
  input,
  preserveModules = false,
}) {
  const outputPath = `lib/${name || format}`;
  const outputName = `${outputPath}/index.js`;

  return {
    input,
    output: {
      name: 'index',
      format,
      ...(preserveModules
        ? {
            dir: outputPath,
            preserveModules,
          }
        : { file: outputName }),
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      external(),
      typescript({
        tsconfigOverride,
        clean: true,
      }),
      resolve(),
      commonjs({
        include: /\/node_modules\//,
      }),
      sourcemaps(),
    ],
  };
}

const outputs = [
  {
    format: 'umd',
    input: pkg.source,
  },
  {
    format: 'cjs',
    input: pkg.source,
    preserveModules: true,
  },
  {
    format: 'amd',
    input: pkg.source,
    preserveModules: true,
  },
  {
    name: 'esm',
    tsconfigOverride: {
      compilerOptions: {
        target: 'es2016',
      },
    },
    format: 'es',
    input: pkg.source,
    preserveModules: true,
  },
];

export default outputs.map(createRollupConfig);
