/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSync } = require('esbuild');

const options = {
  outdir: 'lib',
  bundle: true,
  external: ['@turf/distance'],
  // minify: true,
  sourcemap: true,
};

void buildSync({
  ...options,
  format: 'esm',
  entryPoints: ['src/index.ts'],
});

void buildSync({
  ...options,
  entryPoints: ['src/cli.ts'],
  bundle: true,
  external: ['@turf/distance'],
  platform: 'node',
  // format: 'cjs',
});
