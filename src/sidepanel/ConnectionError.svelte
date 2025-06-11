<script lang="ts">
  import LinkButton from '../components/LinkButton.svelte';
  export let port: string = '8765';
</script>

<div class="error-message">
  <h2>Failed to connect to Anki</h2>
  <p>Please make sure:</p>
  <ul>
    <li>Anki is running</li>
    <li>AnkiConnect add-on is installed</li>
    <li>Port used to connect to AnkiConnect (currently {port}) is configured correctly. You can edit configuration in the extension <LinkButton
    on:click>options</LinkButton>.</li>
  </ul>
</div>

<style>
  .error-message {
    padding: 40px 20px;
    color: #666;
  }
  h2 {
    margin: 0 0 10px;
    font-size: 18px;
  }
  p {
    margin: 0;
    font-size: 14px;
  }
  ul {
    margin-top: 0.5rem;
    padding-left: 1rem;
  }
  li {
    line-height: 1.5;
  }
</style>
