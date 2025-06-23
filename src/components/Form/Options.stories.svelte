<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { action } from 'storybook/actions';
  import Options from './Options.svelte';

  const options = ['Option 1', 'Option 2', 'Option 3'];
  const selected = 'Option 1';
  const label = 'Select an option';

  const { Story } = defineMeta({
    title: 'Components/Options',
    component: Options,
    args: {
      options,
      selected,
      label,
      disabled: false,
      onchange: action('onchange'),
    },
  });
</script>

<Story name="Default" />

<Story name="Without Label" args={{ label: undefined }} />

<Story name="Without selected" args={{ selected: undefined }} />

<Story name="Disabled" args={{ disabled: true }} />
