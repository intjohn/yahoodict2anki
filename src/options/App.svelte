<script lang="ts">
  import Button from '../components/Button.svelte';
  import StatusMessage from '../components/StatusMessage.svelte';
  
  let port = '8765';
  let statusMessage = '';
  let statusType: 'success' | 'error' | '' = '';

  // Load saved port when component mounts
  chrome.storage.sync.get(['ankiConnectPort'], (result) => {
    if (result.ankiConnectPort) {
      port = result.ankiConnectPort;
    }
  });

  // Save port when it changes
  function savePort() {
    const portNumber = parseInt(port, 10);
    if (isNaN(portNumber) || portNumber < 1 || portNumber > 65535) {
      statusMessage = 'Please enter a valid port number (1-65535)';
      statusType = 'error';
      setTimeout(() => {
        statusMessage = '';
        statusType = '';
      }, 3000);
      return;
    }

    chrome.storage.sync.set(
      {
        ankiConnectPort: port,
      },
      () => {
        statusMessage = 'Options saved.';
        statusType = 'success';
        setTimeout(() => {
          statusMessage = '';
          statusType = '';
        }, 3000);
      }
    );
  }
</script>

<style>
  .container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    font-family: system-ui, -apple-system, sans-serif;
  }
  .form-group {
    margin-bottom: 20px;
  }
  label {
    display: block;
    margin-bottom: 5px;
    font-weight: 600;
    color: #333;
  }
  input {
    width: 100%;
    max-width: 200px;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
  input:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2);
  }
</style>

<div class="container">
  <h1>Yahoo Dictionary to Anki Options</h1>
  
  <div class="form-group">
    <label for="port">AnkiConnect Port:</label>
    <input
      type="number"
      id="ankiConnectPort"
      bind:value={port}
      min="1"
      max="65535"
    />
  </div>

  <Button on:click={savePort}>Save</Button>
  <StatusMessage message={statusMessage} type={statusType} />
</div> 