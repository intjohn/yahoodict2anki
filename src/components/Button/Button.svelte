<script lang="ts">
  let {
    children,
    type = 'button' as 'button' | 'submit' | 'reset',
    class: className = '',
    ...rest
  } = $props();
</script>

<button {type} class={className} {...rest}>
  {@render children()}
</button>

<style>
  button {
    background: var(--color-primary);
    color: var(--color-text-inverse);
    border: none;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: var(--font-size-md);
    transition: background var(--transition-normal);
  }
  button:disabled {
    background: var(--color-disabled);
    cursor: not-allowed;
  }
  button:hover:not(:disabled) {
    background: var(--color-primary-hover);
  }
</style>
