import type { StorybookConfig } from '@storybook/svelte-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|ts|svelte)'],
  addons: [
    {
      name: '@storybook/addon-svelte-csf',
    },
  ],
  framework: {
    name: '@storybook/svelte-vite',
    options: {},
  },
  core: {
    disableTelemetry: true,
    builder: {
      name: '@storybook/builder-vite',
      options: {
        viteConfigPath: './vitest.config.ts',
      },
    },
  },
};
export default config;
