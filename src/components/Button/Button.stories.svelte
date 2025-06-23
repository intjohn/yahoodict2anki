<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { action } from 'storybook/actions';
  import Button from './Button.svelte';

  const { Story } = defineMeta({
    title: 'Components/Button',
    component: Button,
    args: {
      onclick: action('clicked'),
    },
  });
</script>

<Story name="Default">Click me</Story>

<Story name="Disabled" args={{ disabled: true }}>I am disabled</Story>
