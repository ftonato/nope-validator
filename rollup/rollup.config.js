import pkg from '../package.json';

import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import external from 'rollup-plugin-peer-deps-external';
import sourcemaps from 'rollup-plugin-sourcemaps';
import typescript from 'rollup-plugin-typescript2';

export function createRollupConfig({ name, format, tsconfig, input }) {
  const outputName = `lib/${format}/` + `${name}.js`;

  return {
    input: input,
    output: {
      name,
      format,
      file: outputName,
      sourcemap: true,
      exports: 'named',
    },
    plugins: [
      external(),
      typescript({
        tsconfig,
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
  name: 'index',
  format: 'umd',
  input: pkg.source,
};

export default createRollupConfig(umd);
