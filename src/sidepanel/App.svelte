<script lang="ts">
  import type { WordData } from '../types';
  import { SidePanelMessage } from '../types';
  import WordCard from './WordCard.svelte';
  import UnsupportedMessage from './UnsupportedMessage.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';

  let wordData: WordData | undefined;
  let isSupported = false;
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
            wordData = data;
            isSupported = !!(data && (data.word || data.definition));
            isLoading = false;
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

<style>
  .container {
    font-family: system-ui, -apple-system, sans-serif;
    padding: 20px;
    margin: 0;
  }
</style>

<div class="container">
  {#if isLoading}
    <LoadingSpinner />
  {:else if isSupported}
    <WordCard {wordData} />
  {:else}
    <UnsupportedMessage />
  {/if}
</div> 