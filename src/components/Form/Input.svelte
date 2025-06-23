<script lang="ts">
  import { randomUUID } from '../../utils/random';

  let {
    type = 'text',
    id = randomUUID(),
    errorMessage = '',
    value = $bindable(''),
    class: inputClass = '',
    errorClass = '',
    bindInput = $bindable(null),
    ...rest
  } = $props();
</script>

<div class="input-container">
  <input class="input {inputClass}" {type} {id} bind:this={bindInput} bind:value {...rest} />
  {#if errorMessage}
    <p class="error {errorClass}">{errorMessage}</p>
  {/if}
</div>

<style>
  .input-container {
    display: flex;
    flex-direction: column;
    position: relative;
  }

  .input {
    color: var(--color-text-content);
    font-size: var(--font-size-sm);
    width: 15rem;
    padding: 0.5rem;
    border: 1px solid var(--color-border-primary);
    border-radius: var(--radius-sm);
    outline: none;
    transition: border-color 0.2s;
  }

  .input:focus {
    border-color: var(--color-border-focus);
  }

  .input:disabled {
    background-color: var(--color-disabled-bg);
    border-color: var(--color-border-primary);
    color: var(--color-text-muted);
    cursor: not-allowed;
  }

  .input:has(+ .error) {
    border-color: var(--color-error);
  }

  .input::placeholder {
    color: var(--color-text-muted);
  }

  .error {
    color: red;
    font-size: 0.8rem;
    font-weight: 600;
    position: absolute;
    top: 100%;
    left: 0.5rem;
    margin: 0 0 0 0;
    white-space: nowrap;
  }
</style>
