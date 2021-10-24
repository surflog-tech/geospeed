/* eslint-disable @typescript-eslint/no-var-requires */
const { buildSync } = require('esbuild');

const options = {
  outdir: 'lib',
  bundle: true,
  // external: ['@turf/distance'],
  minify: true,
  sourcemap: true,
};

void buildSync({
  ...options,
  platform: 'browser',
  entryPoints: ['src/index.ts'],
});

void buildSync({
  ...options,
  platform: 'node',
  entryPoints: ['src/cli.ts'],
});
