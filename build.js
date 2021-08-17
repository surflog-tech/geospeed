/* eslint-disable @typescript-eslint/no-var-requires */
const { build } = require('esbuild');

const options = {
  outdir: 'lib',
  bundle: true,
  external: ['@turf/distance'],
  // minify: true,
  sourcemap: true,
};

void build({
  ...options,
  entryPoints: ['src/index.ts'],
});

void build({
  ...options,
  entryPoints: ['src/cli.ts'],
  bundle: true,
  external: ['@turf/distance'],
  platform: 'node',
  format: 'cjs',
});
