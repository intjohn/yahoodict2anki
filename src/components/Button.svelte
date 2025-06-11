<script lang="ts">
  export let disabled = false;
  export let type: 'button' | 'submit' = 'button';
</script>

<button {type} {disabled} on:click>
  <slot />
</button>

<style>
  button {
    background: #4caf50;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.2s;
  }
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  button:hover:not(:disabled) {
    background: #45a049;
  }
</style>
