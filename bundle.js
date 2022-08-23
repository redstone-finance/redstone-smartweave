const { build } = require('esbuild');
const rimraf = require('rimraf');

const clean = async () => {
  return new Promise((resolve) => {
    rimraf('./bundles', () => resolve());
  });
};

const runBuild = async () => {
  await clean();

  const webExternals = [
    'events'
  ];

  const iifeBuild = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'browser',
    target: ['esnext'],
    format: 'iife',
    globalName: 'warp',
    external: webExternals
  };

  console.log('Building web legacy bundle.');
  build({
    ...iifeBuild,
    minify: true,
    outfile: './bundles/web.iife.bundle.min.js'
  }).catch((e) => {
    console.log(e);
    process.exit(1);
  });

  const esmBuild = {
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'browser',
    target: ['esnext'],
    format: 'esm',
    globalName: 'warp',
    external: webExternals
  };

  console.log('Building web bundle.');
  build({
    ...esmBuild,
    minify: true,
    outfile: './bundles/web.bundle.min.js'
  }).catch((e) => {
    console.log(e);
    process.exit(1);
  });

  console.log('Building node bundle.');
  build({
    entryPoints: ['./src/index.ts'],
    bundle: true,
    platform: 'node',
    target: ['esnext'],
    format: 'cjs',
    minify: true,
    outfile: './bundles/node.bundle.min.js'
  }).catch((e) => {
    console.log(e);
    process.exit(1);
  });
};
runBuild().finally(() => {
  console.log('Build done.');
});

module.exports = runBuild;
