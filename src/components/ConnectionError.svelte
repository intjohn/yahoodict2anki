<script lang="ts">
  import LinkButton from './LinkButton.svelte';
  export let port: string = '8765';
</script>

<div class="error-message">
  Failed to connect to Anki. Please make sure: 1. Anki is running 2. AnkiConnect add-on is installed
  3. Port {port} is configured correctly You can configure the port in the extension <LinkButton
    on:click>options</LinkButton
  >.
</div>

<style>
  .error-message {
    color: #c62828;
    background-color: #fbe9e7;
    border: 1px solid #ffab91;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    white-space: pre-line;
    line-height: 1.5;
  }
  :global(.error-message .link-button) {
    color: #c62828;
  }
</style>
