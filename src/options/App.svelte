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
      : '請輸入有效的連接埠號碼 (1-65535)';
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
      statusMessage = '設定已儲存';
      statusType = 'success';
      setTimeout(() => {
        statusMessage = '';
        statusType = '';
      }, 3000);
    } catch (error) {
      statusMessage = `無法儲存設定，發生錯誤：${error}`;
      statusType = 'error';
    }
  };
</script>

<div class="options-page">
  <div class="left-side">
    <img src={extensionIconUrl} alt="Extension Icon" class="extension-icon" />
  </div>
  <div class="options-container">
    <h1>Yahoo Dictionary to Anki 設定</h1>

    <div class="options-form">
      <NumberInput
        label="AnkiConnect 連接埠"
        bind:value={port}
        min={1}
        max={65535}
        errorMessage={portErrorMessage}
        onInput={checkPort}
        class="form-group"
        labelClass="form-label"
      />

      <TagPicker
        bind:inputValue={tagInputValue}
        label="預設筆記標籤"
        pickedTags={defaultTags}
        onPick={handleTagPick}
        onRemove={handleTagRemove}
        class="form-group"
        labelClass="form-label"
      />

      <Button class="save-button" onclick={submit}>儲存設定</Button>
      <StatusMessage message={statusMessage} type={statusType} />
    </div>
  </div>
</div>

<style>
  .options-page {
    max-width: 800px;
    min-height: 100vh;
    margin: 0 auto;
    display: flex;
    align-items: stretch;
  }

  .left-side {
    padding: var(--spacing-xl);
  }

  .options-container {
    padding: var(--spacing-xl);
    padding-left: calc(var(--spacing-xl) * 1.5);
    box-shadow: var(--shadow-layout-left);
  }

  .options-form {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
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
    font-size: var(--font-size-md);
  }

  .options-form :global(.form-group) {
    border-left: 5px solid var(--color-bg-secondary);
    padding-left: var(--spacing-md);
  }

  .options-form :global(.form-group) :global(.form-label) {
    background: var(--color-bg-primary);
    padding-bottom: 5px;
    margin-left: calc(-5px - var(--spacing-md));
  }
</style>
