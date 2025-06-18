<script lang="ts">
  import type { WordData } from '../wordData';
  import { SidePanelMessage } from '../extension';
  import AnkiNoteCreator from './AnkiNoteCreator.svelte';
  import UnsupportedMessage from './UnsupportedMessage.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let wordData: WordData | undefined;
  let isLoading = true;

  // Request initial data when side panel opens
  function fetchWordData(): void {
    isLoading = true;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'GET_WORD_DATA' },
          { frameId: 0 },
          (data: WordData | undefined) => {
            const error = chrome.runtime.lastError;
            if (error) {
              // This might happen when side panel open for a restricted tab,
              // e.g. chrome://extensions
              // where content script is not allowed to run
              wordData = undefined;
              isLoading = false;
            } else {
              wordData = data;
              isLoading = false;
            }
          }
        );
      } else {
        isLoading = false;
      }
    });
  }

  // Handle messages from background script
  chrome.runtime.onMessage.addListener((message: SidePanelMessage) => {
    switch (message) {
      case SidePanelMessage.ContentLoading:
        isLoading = true;
        break;
      case SidePanelMessage.ContentReloaded:
        fetchWordData();
        break;
      case SidePanelMessage.CloseSidePanel:
        window.close();
        break;
    }
  });

  // Create liveness connection
  chrome.runtime.connect({ name: SidePanelMessage.SidePanelAlive });

  // Initial fetch
  fetchWordData();
</script>

<div class="container">
  {#if isLoading}
    <LoadingSpinner />
  {:else if wordData}
    <AnkiNoteCreator {wordData} />
  {:else}
    <UnsupportedMessage />
  {/if}
</div>

<style>
  .container {
    font-family:
      system-ui,
      -apple-system,
      sans-serif;
    padding: 20px;
    margin: 0;
  }
</style>
