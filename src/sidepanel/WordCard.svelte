<script lang="ts">
  import type { WordData } from '../types';
  import { AnkiClient } from '../utils/AnkiClient';

  export let wordData: WordData | undefined;

  let decks: string[] = [];
  let models: string[] = [];
  let selectedDeck = '';
  let selectedModel = '';
  let modelFields: string[] = [];
  let fieldMappings = {
    word: '',
    pronounce: '',
    definition: ''
  };
  let allowDuplicate = false;
  let statusMessage = '';
  let statusType: 'success' | 'error' | '' = '';
  let isProcessing = false;

  // Clear status message after a delay
  function clearStatusAfterDelay(shouldClose = false) {
    setTimeout(() => {
      statusMessage = '';
      statusType = '';
      if (shouldClose) {
        window.close();
      }
    }, 3000);
  }

  // Save user preferences
  async function savePreferences() {
    await chrome.storage.sync.set({
      ankiPreferences: {
        selectedDeck,
        selectedModel,
        fieldMappings,
        allowDuplicate
      }
    });
  }

  // Load user preferences
  async function loadPreferences() {
    const result = await chrome.storage.sync.get('ankiPreferences');
    if (result.ankiPreferences) {
      selectedDeck = result.ankiPreferences.selectedDeck || '';
      selectedModel = result.ankiPreferences.selectedModel || '';
      fieldMappings = result.ankiPreferences.fieldMappings || {
        word: '',
        pronounce: '',
        definition: ''
      };
      allowDuplicate = result.ankiPreferences.allowDuplicate || false;
    }
  }

  // Initialize AnkiClient and fetch decks and models when component mounts
  async function fetchDecksAndModels() {
    try {
      const ankiClient = new AnkiClient();
      
      // Fetch decks
      decks = await ankiClient.getDeckNames();
      
      // Fetch models (note types)
      models = await ankiClient.getModelNames();

      // Load saved preferences
      await loadPreferences();

      // If saved deck/model doesn't exist anymore, use first available
      if (!decks.includes(selectedDeck)) {
        selectedDeck = decks[0] || '';
      }
      if (!models.includes(selectedModel)) {
        selectedModel = models[0] || '';
      }

      // Update model fields
      await updateModelFields();
    } catch (error) {
      console.error('Failed to fetch decks and models:', error);
      alert('Failed to communicate with AnkiConnect. Is it running?');
    }
  }

  // Update model fields when model selection changes
  async function updateModelFields() {
    try {
      const ankiClient = new AnkiClient();
      modelFields = await ankiClient.getModelFieldNames(selectedModel);
      
      // If we have saved mappings for this model and they're valid, use them
      const savedMappings = fieldMappings;
      const validMappings = Object.values(savedMappings).every(field => 
        field === '' || modelFields.includes(field)
      );

      if (!validMappings) {
        // Try to intelligently map fields
        fieldMappings = {
          word: modelFields.find(f => 
            f.toLowerCase().includes('word') || 
            f.toLowerCase().includes('phrase')
          ) || modelFields[0] ||'',
          pronounce: modelFields.find(f => 
            f.toLowerCase().includes('pronounce')
          ) || modelFields[1] || modelFields[0] || '',
          definition: modelFields.find(f => 
            f.toLowerCase().includes('definition') || 
            f.toLowerCase().includes('meaning')
          ) || modelFields[2] || modelFields[1] || modelFields[0] || ''
        };
      }

      // Save the new preferences
      await savePreferences();
    } catch (error) {
      console.error('Failed to fetch model fields:', error);
    }
  }

  // Handle model selection change
  async function onModelChange() {
    await updateModelFields();
  }

  // Handle deck selection change
  async function onDeckChange() {
    await savePreferences();
  }

  // Handle field mapping change
  async function onMappingChange() {
    await savePreferences();
  }

  async function addToAnki() {
    if (!wordData) return;
    
    try {
      isProcessing = true;
      const ankiClient = new AnkiClient();
      const fields: { [key: string]: string } = {};
      const fieldContents: { [key: string]: string[] } = {};
      
      // First, collect all content for each Anki field
      Object.entries(fieldMappings).forEach(([dataField, ankiField]) => {
        if (ankiField && wordData[dataField as keyof WordData]) {
          if (!fieldContents[ankiField]) {
            fieldContents[ankiField] = [];
          }
          fieldContents[ankiField].push(wordData[dataField as keyof WordData] || '');
        }
      });

      // Then combine contents with <br/> for fields that have multiple mappings
      Object.entries(fieldContents).forEach(([ankiField, contents]) => {
        fields[ankiField] = contents.join('<br/>');
      });

      await ankiClient.addNote({
        deckName: selectedDeck,
        modelName: selectedModel,
        fields,
        options: {
          allowDuplicate,
        },
        tags: ['yahoo2anki'],
      });
      statusMessage = 'Card added successfully!';
      statusType = 'success';
      clearStatusAfterDelay(true);
    } catch (error) {
      if (error instanceof Error) {
        statusMessage = `Failed to add note: ${error.message}`;
      } else {
        statusMessage = 'Failed to communicate with AnkiConnect. Is it running?';
      }
      statusType = 'error';
      isProcessing = false;
    }
  }

  // Fetch decks and models when component mounts
  fetchDecksAndModels();
</script>

<style>
  .word-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
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
  .field {
    margin-bottom: 15px;
  }
  .field:last-child {
    margin-bottom: 0;
  }
  .field-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  .field-content {
    color: #666;
    line-height: 1.5;
    margin-bottom: 8px;
    background: #f8f9fa;
    padding: 8px;
    border-radius: 4px;
  }
  .field-mapping {
    margin-top: 4px;
    font-size: 14px;
  }
  .select-container {
    margin-bottom: 15px;
  }
  .select-container:last-child {
    margin-bottom: 0;
  }
  select {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    margin-top: 5px;
  }
  .button-container {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .checkbox-container {
    display: flex;
    align-items: center;
    gap: 6px;
    color: #666;
    font-size: 14px;
  }
  input[type="checkbox"] {
    margin: 0;
    cursor: pointer;
  }
  label {
    cursor: pointer;
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
  button:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
  button:hover:not(:disabled) {
    background: #45a049;
  }
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

<div class="word-card">
  <div class="group">
    <div class="group-title">Anki Settings</div>
    <div class="select-container">
      <div class="field-label">Deck</div>
      <select bind:value={selectedDeck} on:change={onDeckChange}>
        {#each decks as deck}
          <option value={deck}>{deck}</option>
        {/each}
      </select>
    </div>

    <div class="select-container">
      <div class="field-label">Note Type</div>
      <select bind:value={selectedModel} on:change={onModelChange}>
        {#each models as model}
          <option value={model}>{model}</option>
        {/each}
      </select>
    </div>
  </div>

  <div class="group">
    <div class="group-title">Word Data</div>
    <div class="field">
      <div class="field-label">Word or Phrase</div>
      <div class="field-content">{wordData?.word ?? ''}</div>
      <div class="field-mapping">
        <select bind:value={fieldMappings.word} on:change={onMappingChange}>
          <option value="">-- Map to field --</option>
          {#each modelFields as field}
            <option value={field}>{field}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="field">
      <div class="field-label">Pronounce</div>
      <div class="field-content">{wordData?.pronounce ?? ''}</div>
      <div class="field-mapping">
        <select bind:value={fieldMappings.pronounce} on:change={onMappingChange}>
          <option value="">-- Map to field --</option>
          {#each modelFields as field}
            <option value={field}>{field}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="field">
      <div class="field-label">Definition</div>
      <div class="field-content">{wordData?.definition ?? ''}</div>
      <div class="field-mapping">
        <select bind:value={fieldMappings.definition} on:change={onMappingChange}>
          <option value="">-- Map to field --</option>
          {#each modelFields as field}
            <option value={field}>{field}</option>
          {/each}
        </select>
      </div>
    </div>
  </div>

  <div class="button-container">
    <button 
      on:click={addToAnki} 
      disabled={!wordData?.word || !wordData?.definition || !selectedDeck || !selectedModel || !fieldMappings.word || !fieldMappings.definition || isProcessing}
    >
      {isProcessing ? 'Adding...' : 'Add to Anki'}
    </button>
    <div class="checkbox-container">
      <input 
        type="checkbox" 
        id="allowDuplicate" 
        bind:checked={allowDuplicate} 
        on:change={savePreferences}
        disabled={isProcessing}
      >
      <label for="allowDuplicate">Allow duplicate</label>
    </div>
  </div>
  {#if statusMessage}
    <div class="status-message {statusType} visible">
      {statusMessage}
    </div>
  {/if}
</div> 