<script lang="ts">
  import { yahooFields, type WordData, type YahooDataField } from '../wordData';
  import type { UserPreferences } from '../types/preferences';
  import Button from '../components/Button.svelte';
  import StatusMessage from '../components/StatusMessage.svelte';
  import AnkiSettings from '../components/AnkiSettings.svelte';
  import WordDataField from '../components/WordDataField.svelte';
  import ConnectionError from './ConnectionErrorMessage.svelte';
  import Checkbox from '../components/Checkbox.svelte';
  import { getAnkiClient } from './singletons/ankiClientSingleton';
  import { getOptions } from './singletons/optionsSingleton';
  import { AnkiConnectionError } from '../utils/ankiClient';
  import { DEFAULT_PREFERENCES } from '../types/preferences';
  import { loadUserPreferences, saveUserPreferences } from '../utils/userPreferences';

  let { wordData }: { wordData: WordData } = $props();

  let decks: string[] = $state([]);
  let models: string[] = $state([]);
  let modelFields: string[] = $state([]);
  let userPreferences: UserPreferences = $state(DEFAULT_PREFERENCES);
  let statusMessage = $state('');
  let status: 'success' | 'error' | '' = $state('');
  let isProcessing = $state(false);
  let hasConnectionError = $state(false);
  let ankiClientPort = $state('');
  let fieldMapping: string[] = $state(Array(yahooFields.length).fill(''));

  // Clear status message after a delay
  function closeAfterDelay() {
    setTimeout(() => {
      window.close();
    }, 1200);
  }

  // Update user preferences
  async function updateUserPreferences() {
    if (userPreferences.selectedModel) {
      userPreferences.fieldMappings[userPreferences.selectedModel] = [...fieldMapping];
      await saveUserPreferences($state.snapshot(userPreferences));
    }
  }

  // Initialize AnkiClient and fetch decks and models when component mounts
  async function fetchDecksAndModels() {
    try {
      userPreferences = await loadUserPreferences();
      const client = await getAnkiClient();

      // Fetch decks and models
      decks = await client.getDeckNames();
      models = await client.getModelNames();

      // If saved deck/model doesn't exist anymore, use first available
      if (!decks.includes(userPreferences.selectedDeck)) {
        userPreferences.selectedDeck = decks[0] || '';
      }
      if (!models.includes(userPreferences.selectedModel)) {
        userPreferences.selectedModel = models[0] || '';
      }

      await mapFields();
      hasConnectionError = false;
    } catch (error) {
      if (error instanceof AnkiConnectionError) {
        hasConnectionError = true;
        ankiClientPort = (await getOptions()).anki.port.toString();
      }
    }
  }

  // Update model fields when model selection changes
  async function mapFields() {
    try {
      const client = await getAnkiClient();
      modelFields = await client.getModelFieldNames(userPreferences.selectedModel);

      // If we have saved mappings for this model and they're valid, use them
      const savedMapping =
        userPreferences.fieldMappings[userPreferences.selectedModel] || ([] as string[]);

      let j = 0;
      for (let i = 0; i < fieldMapping.length; i++) {
        if (i < savedMapping.length && modelFields.includes(savedMapping[i])) {
          // A valid saved mapping exists for this field
          fieldMapping[i] = savedMapping[i];
        } else {
          // Determine a new mapping for this field
          if (j < modelFields.length) {
            fieldMapping[i] = modelFields[j++];
          } else {
            fieldMapping[i] = modelFields[j - 1] || '';
          }
        }
      }

      await updateUserPreferences();
    } catch {
      // There's a connection error when attempting to connect to Anki
      // Display connection error message
      hasConnectionError = true;
    }
  }

  async function addToAnki() {
    if (!wordData) return;

    try {
      isProcessing = true;
      const client = await getAnkiClient();
      const fields: { [key: string]: string } = {};
      const fieldContents: { [key: string]: string[] } = {};
      const mappings = userPreferences.fieldMappings[userPreferences.selectedModel];

      if (!mappings || mappings.length !== yahooFields.length) {
        return;
      }

      for (let i = 0; i < mappings.length; i++) {
        const sourceField = yahooFields[i];
        const targetField = mappings[i];
        if (!fieldContents[targetField]) {
          fieldContents[targetField] = [];
        }
        fieldContents[targetField].push(wordData[sourceField as YahooDataField] || '');
      }

      // Then combine contents with <br/> for fields that have multiple mappings
      Object.entries(fieldContents).forEach(([targetField, contents]) => {
        fields[targetField] = contents.join('<br/>');
      });

      await client.addNote({
        deckName: userPreferences.selectedDeck,
        modelName: userPreferences.selectedModel,
        fields,
        options: {
          allowDuplicate: userPreferences.allowDuplicate,
        },
        tags: ['yahoo2anki'],
      });
      statusMessage = 'Card added successfully!';
      status = 'success';
      isProcessing = false;
      closeAfterDelay();
    } catch (error) {
      if (error instanceof Error) {
        statusMessage = `Failed to add note: ${error.message} ${error.name} ${error.stack}`;
      } else {
        statusMessage = 'Failed to communicate with AnkiConnect. Is it running?';
      }
      status = 'error';
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
    <ConnectionError on:click={openOptions} port={ankiClientPort} />
  {:else}
    <AnkiSettings
      {decks}
      {models}
      bind:selectedDeck={userPreferences.selectedDeck}
      bind:selectedModel={userPreferences.selectedModel}
      disabled={isProcessing}
      onDeckChange={updateUserPreferences}
      onModelChange={mapFields}
    />

    <div class="group">
      <div class="group-title">Word Data</div>
      <WordDataField
        label="Word or Phrase"
        value={wordData.word}
        {modelFields}
        bind:selectedField={fieldMapping[0]}
        disabled={isProcessing}
        on:change={updateUserPreferences}
      />

      <WordDataField
        label="Pronounce"
        value={wordData?.pronounce ?? ''}
        {modelFields}
        bind:selectedField={fieldMapping[1]}
        disabled={isProcessing}
        on:change={updateUserPreferences}
      />

      <WordDataField
        label="Definition"
        value={wordData?.definition ?? ''}
        {modelFields}
        bind:selectedField={fieldMapping[2]}
        disabled={isProcessing}
        on:change={updateUserPreferences}
      />
    </div>

    <div class="button-container">
      <Button
        on:click={addToAnki}
        disabled={!wordData?.word ||
          !wordData?.definition ||
          !userPreferences.selectedDeck ||
          !userPreferences.selectedModel ||
          !fieldMapping[0] ||
          !fieldMapping[1] ||
          !fieldMapping[2] ||
          isProcessing ||
          status === 'success'}
      >
        {#if status === 'success'}
          Done
        {:else}
          Add to Anki
        {/if}
      </Button>
      <Checkbox
        label="Allow duplicate"
        bind:checked={userPreferences.allowDuplicate}
        disabled={isProcessing}
        on:change={updateUserPreferences}
      />
    </div>

    <StatusMessage message={statusMessage} type={status} />
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
</style>
