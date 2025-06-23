<script lang="ts">
  import FormGroup from './FormGroup.svelte';
  import FormLabel from './FormLabel.svelte';
  import { randomUUID } from '../../utils/random';

  let {
    id = randomUUID(),
    label = '',
    name = '',
    options = [],
    selected = $bindable(''),
    disabled = false,
    class: className = '',
    labelClass = '',
    ...rest
  } = $props();
</script>

{#snippet selector(instanceClass = '')}
  <select bind:value={selected} {disabled} {name} {id} class={instanceClass} {...rest}>
    {#each options as option (option)}
      <option value={option}>{option}</option>
    {/each}
  </select>
{/snippet}

{#if label}
  <FormGroup class={className}>
    <FormLabel forId={id} {label} class={labelClass} />
    {@render selector()}
  </FormGroup>
{:else}
  {@render selector(className)}
{/if}

<style>
  select {
    color: var(--color-text-content);
    width: 100%;
    padding: var(--spacing-sm);
    font-size: var(--font-size-sm);
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-sm);
    background-color: var(--color-bg-primary);
  }

  select:focus {
    outline: none;
    border-color: var(--color-border-focus);
  }

  select:disabled {
    color: var(--color-text-muted);
    background: var(--color-disabled-bg);
    cursor: not-allowed;
  }
</style>
