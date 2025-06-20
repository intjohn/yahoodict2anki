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
    color: #333;
    font-size: 0.875rem;
    width: 15rem;
    padding: 0.5rem;
    border: 1px solid #aaa;
    border-radius: 0.25rem;
    outline: none;
    transition: border-color 0.2s;
    margin-bottom: 0.5rem;
  }

  .input:focus {
    border-color: #007bff;
  }

  .input:disabled {
    background-color: #f5f5f5;
    border-color: #ccc;
    color: #8e9398;
    cursor: not-allowed;
  }

  .input:has(+ .error) {
    border-color: red;
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
