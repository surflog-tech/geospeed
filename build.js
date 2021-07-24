const { build } = require('esbuild');

const options = {
  outdir: 'lib',
  // bundle: true,
  // external: ['@turf/distance'],
  minify: true,
  sourcemap: true,
};

build({
  ...options,
  entryPoints: ['src/index.ts'],
});

build({
  ...options,
  entryPoints: ['src/cli.ts'],
  platform: 'node',
});
