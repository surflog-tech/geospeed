import { buildSync }  from 'esbuild';

const options = {
  outdir: 'lib',
  bundle: true,
  // external: ['@turf/distance'],
  // minify: true,
  sourcemap: true,
};

void buildSync({
  ...options,
  platform: 'node',
  entryPoints: ['src/index.ts'],
});

void buildSync({
  ...options,
  platform: 'node',
  entryPoints: ['src/cli.ts'],
});
