<script lang="ts">
  export let message = '';
  export let type: 'success' | 'error' | '' = '';
</script>

<style>
  .status-message {
    margin-top: 12px;
    padding: 8px 12px;
    border-radius: 4px;
    font-size: 14px;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  .status-message.visible {
    opacity: 1;
  }
  .status-message.success {
    background-color: #e8f5e9;
    color: #2e7d32;
    border: 1px solid #a5d6a7;
  }
  .status-message.error {
    background-color: #fbe9e7;
    color: #c62828;
    border: 1px solid #ffab91;
  }
</style>

{#if message}
  <div class="status-message {type} visible">
    {message}
  </div>
{/if} 