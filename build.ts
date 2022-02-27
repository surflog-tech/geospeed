import { build, BuildOptions }  from 'esbuild';

const options: BuildOptions = {
  outdir: 'lib',
  bundle: true,
  platform: 'node',
  minify: true,
  sourcemap: true,
};

void build({
  ...options,
  entryPoints: ['src/index.ts'],
});

void build({
  ...options,
  entryPoints: ['src/cli.ts'],
});
