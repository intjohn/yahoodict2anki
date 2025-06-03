<script lang="ts">
  let port = '8765';

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
      alert('Please enter a valid port number (1-65535)');
      return;
    }

    chrome.storage.sync.set(
      {
        ankiConnectPort: port,
      },
      () => {
        const status = document.getElementById('status');
        if (status) {
          status.textContent = 'Options saved.';
          setTimeout(() => {
            status.textContent = '';
          }, 2000);
        }
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
  button:hover {
    background: #45a049;
  }
  #status {
    margin-top: 10px;
    color: #4caf50;
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

  <button on:click={savePort}>Save</button>
  <div id="status"></div>
</div> 