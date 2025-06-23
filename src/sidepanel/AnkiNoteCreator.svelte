<script lang="ts">
  import { yahooFields, type WordData, type YahooDataField } from '../wordData';
  import type { UserPreferences } from '../types/preferences';
  import Button from '../components/Button/Button.svelte';
  import StatusMessage from '../components/StatusMessage.svelte';
  import WordDataField from '../components/WordDataField.svelte';
  import ConnectionError from './ConnectionErrorMessage.svelte';
  import Checkbox from '../components/Checkbox.svelte';
  import { getAnkiClient } from './singletons/ankiClientSingleton';
  import { getOptions } from './singletons/optionsSingleton';
  import { AnkiConnectionError } from '../utils/ankiClient';
  import { DEFAULT_PREFERENCES } from '../types/preferences';
  import { loadUserPreferences, saveUserPreferences } from '../utils/userPreferences';
  import TagPicker from '../components/TagPicker/TagPicker.svelte';
  import { loadUserOptions } from '../utils/userOptions';
  import Options from '../components/Form/Options.svelte';
  import htmlFormat from 'html-format';
  import Highlight from 'svelte-highlight';
  import xml from 'svelte-highlight/languages/xml';

  let { wordData }: { wordData: WordData } = $props();

  let decks: string[] = $state([]);
  let models: string[] = $state([]);
  let pickedTags: string[] = $state.raw([]);
  let suggestedTags: string[] = $state.raw([]);
  let tagInputValue = $state('');
  let additionalTags: string[] = [];

  let modelFields: string[] = $state([]);
  let userPreferences: UserPreferences = $state(DEFAULT_PREFERENCES);
  let statusMessage = $state('');
  let status: 'success' | 'error' | '' = $state('');
  let isProcessing = $state(false);
  let hasConnectionError = $state(false);
  let ankiClientPort = $state('');
  let fieldMapping: string[] = $state(Array(yahooFields.length).fill(''));

  let remainingTags: string[] = [];

  function closeAfterDelay() {
    setTimeout(() => {
      window.close();
    }, 1200);
  }

  async function updateUserPreferences() {
    if (userPreferences.selectedModel) {
      userPreferences.fieldMappings[userPreferences.selectedModel] = [...fieldMapping];
      await saveUserPreferences($state.snapshot(userPreferences));
    }
  }

  async function init() {
    try {
      userPreferences = await loadUserPreferences();
      pickedTags = (await loadUserOptions()).anki.defaultTags;

      const client = await getAnkiClient();

      decks = await client.getDeckNames();
      models = await client.getModelNames();
      remainingTags = await client.getTags();
      additionalTags = pickedTags.filter((t) => !remainingTags.includes(t));
      remainingTags = remainingTags.filter((t) => !pickedTags.includes(t));
      suggestedTags = remainingTags;

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
        tags: pickedTags,
      });
      statusMessage = 'Card added successfully!';
      status = 'success';
      isProcessing = false;
      closeAfterDelay();
    } catch (error) {
      if (error instanceof Error) {
        statusMessage = `Failed to add note: ${error.message}`;
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

  function handleTagPick(tag: string) {
    pickedTags = [...pickedTags, tag].sort();
    const newRemainingTags = remainingTags.filter((t) => t !== tag);
    if (newRemainingTags.length === remainingTags.length) {
      additionalTags.push(tag);
    }
    remainingTags = newRemainingTags;
    suggestedTags = remainingTags;
    tagInputValue = '';
  }

  function handleTagInput() {
    const trimmedValue = tagInputValue.trim().toLowerCase();
    suggestedTags = remainingTags.filter((t) => t.toLowerCase().includes(trimmedValue));
  }

  function handleTagRemove(tag: string) {
    pickedTags = pickedTags.filter((t) => t !== tag);
    const newAdditionalTags = additionalTags.filter((t) => t !== tag);
    if (newAdditionalTags.length === additionalTags.length) {
      remainingTags = [...remainingTags, tag].sort();
      suggestedTags = remainingTags;
    } else {
      additionalTags = newAdditionalTags;
    }
  }

  init();
</script>

{#if hasConnectionError}
  <ConnectionError on:click={openOptions} port={ankiClientPort} />
{:else}
  <div class="note-creator">
    <Options
      label="將筆記新增到牌組"
      options={decks}
      bind:selected={userPreferences.selectedDeck}
      disabled={isProcessing}
      onchange={updateUserPreferences}
    />
    <Options
      label="套用筆記類型"
      options={models}
      bind:selected={userPreferences.selectedModel}
      disabled={isProcessing}
      onchange={mapFields}
    />
    <hr />

    <WordDataField
      label="單字或片語"
      {modelFields}
      bind:selectedField={fieldMapping[0]}
      disabled={isProcessing}
      onchange={updateUserPreferences}
    >
      {wordData?.word ?? ''}
    </WordDataField>

    <WordDataField
      label="發音"
      {modelFields}
      bind:selectedField={fieldMapping[1]}
      disabled={isProcessing}
      onchange={updateUserPreferences}
    >
      {wordData?.pronounce ?? ''}
    </WordDataField>

    <WordDataField
      label="定義"
      {modelFields}
      bind:selectedField={fieldMapping[2]}
      disabled={isProcessing}
      onchange={updateUserPreferences}
    >
      <Highlight
        language={xml}
        code={htmlFormat(wordData?.definition?.trim() ?? '')}
        class="html-code"
      />
    </WordDataField>

    <TagPicker
      label="標籤"
      bind:inputValue={tagInputValue}
      suggestions={suggestedTags}
      {pickedTags}
      disabled={isProcessing}
      onPick={handleTagPick}
      onInput={handleTagInput}
      onRemove={handleTagRemove}
    />

    <hr />

    <div class="button-container">
      <Button
        onclick={addToAnki}
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
          完成
        {:else}
          新增筆記
        {/if}
      </Button>
      <Checkbox
        label="允許重複的筆記"
        bind:checked={userPreferences.allowDuplicate}
        disabled={isProcessing}
        onchange={updateUserPreferences}
      />
    </div>

    <StatusMessage message={statusMessage} type={status} />
  </div>
{/if}

<style>
  .note-creator {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
    padding-right: var(--spacing-sm);
  }
  /* .word-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  } */
  .button-container {
    display: flex;
    align-items: center;
    gap: var(--spacing-md);
  }
  .note-creator :global(pre) {
    margin: 0;
  }
  .note-creator :global(pre code.hljs) {
    background: transparent;
    font-size: var(--font-size-xs);
    padding: 0;
  }
</style>
