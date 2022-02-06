import { buildSync, BuildOptions }  from 'esbuild';

const options = {
  outdir: 'lib',
  bundle: true,
  platform: 'node',
  minify: true,
  sourcemap: true,
} as BuildOptions;

void buildSync({
  ...options,
  entryPoints: ['src/index.ts'],
});

void buildSync({
  ...options,
  entryPoints: ['src/cli.ts'],
});
