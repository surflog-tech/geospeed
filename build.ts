import { build, BuildOptions }  from 'esbuild';
import { nodeExternalsPlugin } from 'esbuild-node-externals';

const options: BuildOptions = {
  outdir: 'lib',
  bundle: true,
  platform: 'node',
  minify: true,
  sourcemap: true,
  plugins: [nodeExternalsPlugin()],
};

void build({
  ...options,
  entryPoints: ['src/index.ts'],
});

void build({
  ...options,
  entryPoints: ['src/cli.ts'],
});
