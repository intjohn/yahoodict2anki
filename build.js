import * as esbuild from 'esbuild';
import { copyFile, mkdir } from 'fs/promises';
import sveltePlugin from 'esbuild-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

async function build() {
  // Ensure dist directory exists
  await mkdir('dist', { recursive: true });
  await mkdir('dist/background', { recursive: true });
  await mkdir('dist/sidepanel', { recursive: true });
  await mkdir('dist/content_scripts', { recursive: true });
  await mkdir('dist/images', { recursive: true });
  await mkdir('dist/options', { recursive: true });
  await mkdir('dist/styles', { recursive: true });

  // Copy static files
  await copyFile('manifest.json', 'dist/manifest.json');
  await copyFile('src/sidepanel/sidepanel.html', 'dist/sidepanel/sidepanel.html');
  await copyFile('src/options/options.html', 'dist/options/options.html');
  await copyFile('images/icon.png', 'dist/images/icon.png');
  await copyFile('src/styles/main.css', 'dist/styles/main.css');
  await copyFile('src/styles/theme.css', 'dist/styles/theme.css');

  // Common build options
  const buildOptions = {
    bundle: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2022',
    sourcemap: true,
    loader: {
      '.png': 'dataurl',
    },
  };

  // Svelte plugin configuration
  const svelteOptions = {
    compilerOptions: {
      dev: process.env.NODE_ENV !== 'production',
      css: 'injected',
    },
    preprocess: sveltePreprocess(),
  };

  // Check if watch mode is enabled
  const isWatch = process.argv.includes('--watch');

  const contexts = await Promise.all([
    // Background script
    esbuild.context({
      ...buildOptions,
      entryPoints: ['src/background/background.ts'],
      outfile: 'dist/background/background.js',
    }),
    // Sidepanel script
    esbuild.context({
      ...buildOptions,
      entryPoints: ['src/sidepanel/sidepanel.ts'],
      outfile: 'dist/sidepanel/sidepanel.js',
      plugins: [sveltePlugin(svelteOptions)],
    }),
    // Content script
    esbuild.context({
      ...buildOptions,
      entryPoints: ['src/content_scripts/content.ts'],
      outfile: 'dist/content_scripts/content.js',
    }),
    // Options page script
    esbuild.context({
      ...buildOptions,
      entryPoints: ['src/options/options.ts'],
      outfile: 'dist/options/options.js',
      plugins: [sveltePlugin(svelteOptions)],
    }),
  ]);

  // Build once
  await Promise.all(contexts.map((context) => context.rebuild()));

  // If watch mode is enabled, start watching
  if (isWatch) {
    await Promise.all(contexts.map((context) => context.watch()));
    console.log('Watching for changes...');
  } else {
    await Promise.all(contexts.map((context) => context.dispose()));
  }
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
