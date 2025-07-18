import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json' assert { type: 'json' };

function toCamelCase(name) {
  return name
    .replace(/^@.*\//, '')
    .split(/[^a-zA-Z0-9]+/)
    .map((word, i) =>
      i === 0
        ? word.toLowerCase()
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join('');
}

const externalDeps = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.peerDependencies || {})
]);

export default {
  input: 'src/index.ts',
  external: id =>
    Array.from(externalDeps).some(
      dep => id === dep || id.startsWith(`${dep}/`)
    ),
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: true,
      tsconfigOverride: {
        compilerOptions: {
          declaration: true,
          declarationDir: 'dist/types'
        }
      }
    })
  ],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    },
    {
      file: `dist/umd/${pkg.name}.umd.js`,
      format: 'umd',
      name: toCamelCase(pkg.name),
      globals: {
        react: 'React'
      },
      sourcemap: true,
      plugins: [terser()]
    }
  ]
};