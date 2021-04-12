import pkg from '../package.json';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

export function createRollupConfig(options) {
  const name = options.name;
  const outputName = `lib/${options.format}/` + `${name}.js`;

  return {
    input: options.input,
    output: {
      file: outputName,
      format: options.format,
      name: 'nope-validator',
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      external(),
      typescript({
        tsconfig: options.tsconfig,
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

const umd = {
  name: 'nope-validator',
  format: 'umd',
  input: pkg.source,
};

export default createRollupConfig(umd);
