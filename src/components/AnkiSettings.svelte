<script lang="ts">
  export let decks: string[] = [];
  export let models: string[] = [];
  export let selectedDeck: string;
  export let selectedModel: string;
  export let disabled = false;
  export let onDeckChange: () => void;
  export let onModelChange: () => void;
</script>

<div class="group">
  <div class="group-title">Anki Settings</div>
  <div class="select-container">
    <div class="field-label">Deck</div>
    <select bind:value={selectedDeck} on:change={onDeckChange} {disabled}>
      {#each decks as deck (deck)}
        <option value={deck}>{deck}</option>
      {/each}
    </select>
  </div>

  <div class="select-container">
    <div class="field-label">Note Type</div>
    <select bind:value={selectedModel} on:change={onModelChange} {disabled}>
      {#each models as model (model)}
        <option value={model}>{model}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .group {
    border: 1px solid #eee;
    border-radius: 8px;
    padding: 16px;
    margin-bottom: 20px;
  }
  .group-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
  .select-container {
    margin-bottom: 15px;
  }
  .select-container:last-child {
    margin-bottom: 0;
  }
  .field-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  select {
    width: 100%;
    padding: 6px 8px;
    font-size: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    background-color: white;
  }
  select:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
</style>
