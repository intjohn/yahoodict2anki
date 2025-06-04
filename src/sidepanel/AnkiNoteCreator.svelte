<script lang="ts">
  import type { WordData } from '../types';
  import { AnkiClient } from '../utils/AnkiClient';
  import Button from '../components/Button.svelte';
  import StatusMessage from '../components/StatusMessage.svelte';
  import AnkiSettings from '../components/AnkiSettings.svelte';
  import WordDataField from '../components/WordDataField.svelte';
  import ConnectionError from '../components/ConnectionError.svelte';

  export let wordData: WordData | undefined;

  let decks: string[] = [];
  let models: string[] = [];
  let selectedDeck = '';
  let selectedModel = '';
  let modelFields: string[] = [];
  let fieldMappings = {
    word: '',
    pronounce: '',
    definition: '',
  };
  let allowDuplicate = false;
  let statusMessage = '';
  let statusType: 'success' | 'error' | '' = '';
  let isProcessing = false;
  let hasConnectionError = false;
  let configuredPort = '8765';

  // Clear status message after a delay
  function clearStatusAfterDelay(shouldClose = false) {
    setTimeout(() => {
      statusMessage = '';
      statusType = '';
      if (shouldClose) {
        window.close();
      }
    }, 2000);
  }

  // Save user preferences
  async function savePreferences() {
    await chrome.storage.sync.set({
      ankiPreferences: {
        selectedDeck,
        selectedModel,
        fieldMappings,
        allowDuplicate,
      },
    });
  }

  // Load user preferences
  async function loadPreferences() {
    const result = await chrome.storage.sync.get(['ankiPreferences', 'ankiConnectPort']);
    if (result.ankiPreferences) {
      selectedDeck = result.ankiPreferences.selectedDeck || '';
      selectedModel = result.ankiPreferences.selectedModel || '';
      fieldMappings = result.ankiPreferences.fieldMappings || {
        word: '',
        pronounce: '',
        definition: '',
      };
      allowDuplicate = result.ankiPreferences.allowDuplicate || false;
    }
    if (result.ankiConnectPort) {
      configuredPort = result.ankiConnectPort;
    }
  }

  // Initialize AnkiClient and fetch decks and models when component mounts
  async function fetchDecksAndModels() {
    try {
      await loadPreferences();
      const ankiClient = new AnkiClient();

      // Fetch decks and models
      decks = await ankiClient.getDeckNames();
      models = await ankiClient.getModelNames();

      // If saved deck/model doesn't exist anymore, use first available
      if (!decks.includes(selectedDeck)) {
        selectedDeck = decks[0] || '';
      }
      if (!models.includes(selectedModel)) {
        selectedModel = models[0] || '';
      }

      await updateModelFields();
      hasConnectionError = false;
    } catch (error) {
      console.error('Failed to fetch decks and models:', error);
      hasConnectionError = true;
    }
  }

  // Update model fields when model selection changes
  async function updateModelFields() {
    try {
      const ankiClient = new AnkiClient();
      modelFields = await ankiClient.getModelFieldNames(selectedModel);

      // If we have saved mappings for this model and they're valid, use them
      const savedMappings = fieldMappings;
      const validMappings = Object.values(savedMappings).every(
        (field) => field === '' || modelFields.includes(field)
      );

      if (!validMappings) {
        // Try to intelligently map fields
        fieldMappings = {
          word:
            modelFields.find(
              (f) => f.toLowerCase().includes('word') || f.toLowerCase().includes('phrase')
            ) ||
            modelFields[0] ||
            '',
          pronounce:
            modelFields.find((f) => f.toLowerCase().includes('pronounce')) ||
            modelFields[1] ||
            modelFields[0] ||
            '',
          definition:
            modelFields.find(
              (f) => f.toLowerCase().includes('definition') || f.toLowerCase().includes('meaning')
            ) ||
            modelFields[2] ||
            modelFields[1] ||
            modelFields[0] ||
            '',
        };
      }

      await savePreferences();
    } catch (error) {
      console.error('Failed to fetch model fields:', error);
    }
  }

  async function addToAnki() {
    console.log('addToAnki', wordData);
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

  function openOptions() {
    chrome.runtime.openOptionsPage();
  }

  // Fetch decks and models when component mounts
  fetchDecksAndModels();
</script>

<div class="word-card">
  {#if hasConnectionError}
    <ConnectionError on:click={openOptions} port={configuredPort} />
  {:else}
    <AnkiSettings
      {decks}
      {models}
      bind:selectedDeck
      bind:selectedModel
      disabled={isProcessing}
      onDeckChange={savePreferences}
      onModelChange={updateModelFields}
    />

    <div class="group">
      <div class="group-title">Word Data</div>
      <WordDataField
        label="Word or Phrase"
        value={wordData?.word ?? ''}
        {modelFields}
        bind:selectedField={fieldMappings.word}
        disabled={isProcessing}
        on:change={savePreferences}
      />

      <WordDataField
        label="Pronounce"
        value={wordData?.pronounce ?? ''}
        {modelFields}
        bind:selectedField={fieldMappings.pronounce}
        disabled={isProcessing}
        on:change={savePreferences}
      />

      <WordDataField
        label="Definition"
        value={wordData?.definition ?? ''}
        {modelFields}
        bind:selectedField={fieldMappings.definition}
        disabled={isProcessing}
        on:change={savePreferences}
      />
    </div>

    <div class="button-container">
      <Button
        on:click={addToAnki}
        disabled={!wordData?.word ||
          !wordData?.definition ||
          !selectedDeck ||
          !selectedModel ||
          !fieldMappings.word ||
          !fieldMappings.definition ||
          isProcessing}
        loading={isProcessing}
      >
        <svelte:fragment slot="loading">Adding...</svelte:fragment>
        Add to Anki
      </Button>
      <div class="checkbox-container">
        <input
          type="checkbox"
          id="allowDuplicate"
          bind:checked={allowDuplicate}
          on:change={savePreferences}
          disabled={isProcessing}
        />
        <label for="allowDuplicate" class:disabled={isProcessing}>Allow duplicate</label>
      </div>
    </div>

    <StatusMessage message={statusMessage} type={statusType} />
  {/if}
</div>

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
  input[type='checkbox'] {
    margin: 0;
    cursor: pointer;
  }
  input[type='checkbox']:disabled {
    cursor: not-allowed;
  }
  label {
    cursor: pointer;
  }
  label.disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
</style>
