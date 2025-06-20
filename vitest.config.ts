import { defineConfig } from 'vitest/config';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { sveltePreprocess } from 'svelte-preprocess';

export default defineConfig(({ mode }) => ({
  plugins: [
    svelte({
      preprocess: sveltePreprocess(),
    }),
  ],
  test: {
    environment: 'jsdom',
    include: ['test/**/*.test.ts'],
    setupFiles: ['./vitest-setup.ts'],
  },
  resolve: {
    conditions: mode === 'test' ? ['browser'] : [],
  },
}));
