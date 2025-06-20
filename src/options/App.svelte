<script lang="ts">
  import Button from '../components/Button/Button.svelte';
  import StatusMessage from '../components/StatusMessage.svelte';
  import NumberInput from '../components/NumberInput.svelte';
  import { loadUserOptions, saveUserOptions, isPortValid } from '../utils/userOptions';
  import TagPicker from '../components/TagPicker/TagPicker.svelte';
  import { onMount } from 'svelte';
  import extensionIconUrl from '../../images/icon.png';
  let port = $state('');
  let defaultTags = $state.raw<string[]>([]);
  let statusMessage = $state('');
  let statusType: 'success' | 'error' | '' = $state('');

  let tagInputValue = $state(''); // Dummy state to bind to TagPicker

  let portErrorMessage = $state('');

  // Load options when component mounts
  onMount(async () => {
    const options = await loadUserOptions();
    port = options.anki.port.toString();
    defaultTags = options.anki.defaultTags;
  });

  const checkPort = () => {
    portErrorMessage = isPortValid(parseInt(port, 10))
      ? ''
      : 'Please enter a valid port number (1-65535)';
  };

  const handleTagPick = (tag: string) => {
    defaultTags = [...defaultTags, tag].sort();
  };

  const handleTagRemove = (tag: string) => {
    defaultTags = defaultTags.filter((t) => t !== tag);
  };

  // Save options
  const submit = async () => {
    try {
      await saveUserOptions({ anki: { port: parseInt(port, 10), defaultTags } });
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

<div class="options-page">
  <div class="left-side">
    <img src={extensionIconUrl} alt="Extension Icon" class="extension-icon" />
  </div>
  <div class="options-container">
    <h1>Yahoo Dictionary to Anki Options</h1>

    <div class="options-form">
      <NumberInput
        label="AnkiConnect Port"
        bind:value={port}
        min={1}
        max={65535}
        errorMessage={portErrorMessage}
        onInput={checkPort}
      />

      <TagPicker
        bind:inputValue={tagInputValue}
        label="Default Tags"
        pickedTags={defaultTags}
        onPick={handleTagPick}
        onRemove={handleTagRemove}
      />

      <Button className="save-button" onclick={submit}>Save</Button>
      <StatusMessage message={statusMessage} type={statusType} />
    </div>
  </div>
</div>

<style>
  .options-page {
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    align-items: flex-start;
    gap: var(--spacing-lg);
  }

  .left-side {
    padding: var(--spacing-lg);
  }

  .options-container {
    padding: var(--spacing-lg);
  }

  .options-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-md);
  }

  h1 {
    color: var(--color-text-primary);
    margin-bottom: var(--spacing-lg);
  }

  .extension-icon {
    margin-top: var(--spacing-lg);
    width: 128px;
    height: 128px;
  }

  .options-form :global(.save-button) {
    margin-top: var(--spacing-sm);
    align-self: flex-start;
  }
</style>
