import { build } from 'esbuild'
import { resolve } from 'path'

await build({
  entryPoints: ['server/src/index.ts'],
  bundle: true,
  outfile: 'dist/index.js',
  platform: 'node',
  format: 'esm',
  packages: 'external',
  alias: {
    '@shared': resolve('shared'),
  },
  resolveExtensions: ['.ts', '.js'],
  define: {
    'process.env.NODE_ENV': '"production"'
  },
  conditions: ['node'],
  mainFields: ['module', 'main'],
})