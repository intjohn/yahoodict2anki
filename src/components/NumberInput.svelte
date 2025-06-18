<script lang="ts">
  import { randomUUID } from '../utils/random';

  export let label: string;
  export let value: string;
  export let min: number;
  export let max: number;
  export let id: string = randomUUID();
  export let errorMessage: string;
</script>

<div class="number-input">
  <label class="number-input__label" for={id}>{label}</label>
  <div class="number-input__input-container">
    <input
      class="number-input__input"
      type="number"
      {id}
      bind:value
      {min}
      {max}
      on:change
      on:input
    />
    {#if errorMessage}
      <p class="number-input__error">{errorMessage}</p>
    {/if}
  </div>
</div>

<style>
  .number-input {
    display: flex;
    gap: 0.5rem;
    align-items: baseline;
  }
  .number-input__label {
    font-size: 0.8rem;
    font-weight: 600;
    color: #333;
  }
  .number-input__input-container {
    display: flex;
    flex-direction: column;
    position: relative;
  }
  .number-input__input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #333;
    border-radius: 0.25rem;
    margin-bottom: 1.25rem;
  }
  .number-input__input:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
  .number-input__input:has(+ .number-input__error) {
    border-color: red;
  }
  .number-input__error {
    color: red;
    font-size: 0.8rem;
    font-weight: 600;
    position: absolute;
    bottom: 0;
    margin: 0;
    white-space: nowrap;
  }
</style>
