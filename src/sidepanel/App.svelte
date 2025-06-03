<script lang="ts">
  import type { WordData } from '../types';
  import WordCard from './WordCard.svelte';
  import UnsupportedMessage from './UnsupportedMessage.svelte';

  let wordData: WordData | undefined;
  let isSupported = false;

  // Request initial data when side panel opens
  function fetchWordData(): void {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(
          tabs[0].id,
          { type: 'GET_WORD_DATA' },
          { frameId: 0 },
          (data: WordData | undefined) => {
            wordData = data;
            isSupported = !!(data && (data.word || data.definition));
          }
        );
      }
    });
  }

  // Handle when tab content is reloaded
  chrome.runtime.onMessage.addListener((message: string) => {
    if (message === 'contentReloaded') {
      fetchWordData();
    }
  });

  // Handle side panel to programmatically close
  chrome.runtime.onMessage.addListener((message: string) => {
    if (message === 'closeSidePanel') {
      window.close();
    }
  });

  // Create liveness connection
  chrome.runtime.connect({ name: 'sidePanelAlive' });

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
  {#if isSupported}
    <WordCard {wordData} />
  {:else}
    <UnsupportedMessage />
  {/if}
</div> 