<script lang="ts">
  import { randomUUID } from '../utils/random';
  import FormLabel from './Form/FormLabel.svelte';
  import Options from './Form/Options.svelte';

  let {
    id = randomUUID(),
    label = '',
    modelFields = [],
    selectedField = $bindable(''),
    disabled = false,
    onchange = () => {},
    class: className = '',
    children,
  } = $props();
</script>

<div class="word-data-field {className}">
  {#if label}
    <FormLabel forId={id} {label} class="word-data-field__label" />
  {/if}
  <div class="word-data-field__value">{@render children()}</div>
  <div class="word-data-field__mappings">
    <Options
      label="對應到筆記欄位"
      options={modelFields}
      bind:selected={selectedField}
      {disabled}
      {onchange}
      labelClass="word-data-field__mappings-label"
    />
  </div>
</div>

<style>
  .word-data-field {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-sm);
    padding-left: var(--spacing-md);
  }

  .word-data-field > :global(.word-data-field__label) {
    margin-left: calc(-1 * var(--spacing-md));
  }

  .word-data-field__value {
    font-size: var(--font-size-sm);
    color: var(--color-text-primary);
    line-height: 1.5;
    padding: var(--spacing-sm);
    background: var(--color-bg-slight-highlight);
    border: 2px solid var(--color-border-primary);
    border-radius: var(--radius-sm);
  }

  .word-data-field__mappings {
    font-size: var(--font-size-sm);
    padding-left: var(--spacing-lg);
    border-left: 5px dotted var(--color-bg-secondary);
  }

  .word-data-field :global(.word-data-field__mappings-label) {
    font-size: var(--font-size-xs);
    font-weight: var(--font-weight-normal);
  }
</style>
