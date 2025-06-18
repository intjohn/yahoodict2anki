<script lang="ts">
  import Button from '../components/Button.svelte';
  import StatusMessage from '../components/StatusMessage.svelte';
  import NumberInput from '../components/NumberInput.svelte';
  import { loadUserOptions, saveUserOptions, isPortValid } from '../utils/userOptions';
  import { onMount } from 'svelte';

  let port = $state('');
  let statusMessage = $state('');
  let statusType: 'success' | 'error' | '' = $state('');

  let portErrorMessage = $state('');

  // Load options when component mounts
  onMount(async () => {
    const options = await loadUserOptions();
    port = options.anki.port.toString();
  });

  const checkPort = () => {
    console.log('checkPort', port);
    portErrorMessage = isPortValid(parseInt(port, 10))
      ? ''
      : 'Please enter a valid port number (1-65535)';
  };

  // Save options
  const submit = async () => {
    try {
      await saveUserOptions({ anki: { port: parseInt(port, 10) } });
      statusMessage = 'Options saved.';
      statusType = 'success';
      setTimeout(() => {
        statusMessage = '';
        statusType = '';
      }, 3000);
    } catch (error) {
      statusMessage = `Failed to save options: ${error}`;
      statusType = 'error';
    }
  };
</script>

<div class="container">
  <h1>Yahoo Dictionary to Anki Options</h1>

  <div class="form-group">
    <NumberInput
      label="AnkiConnect Port"
      bind:value={port}
      min={1}
      max={65535}
      errorMessage={portErrorMessage}
      on:input={checkPort}
    />
  </div>

  <Button on:click={submit}>Save</Button>
  <StatusMessage message={statusMessage} type={statusType} />
</div>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
  }
  .form-group {
    margin-bottom: 20px;
  }
</style>
