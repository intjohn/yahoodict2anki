<script lang="ts">
  import type { WordData, AnkiResponse } from '../types';

  export let wordData: WordData | undefined;

  async function addToAnki() {
    try {
      const response = await fetch('http://localhost:8765', {
        method: 'POST',
        body: JSON.stringify({
          action: 'addNote',
          version: 6,
          params: {
            note: {
              deckName: 'Yahoo Dictionary',
              modelName: 'YahooDict',
              fields: {
                WordPhrase: wordData?.word ?? '',
                Pronounce: wordData?.pronounce ?? '',
                Definition: wordData?.definition ?? '',
              },
              options: {
                allowDuplicate: false,
              },
              tags: ['yahoo2anki'],
            },
          },
        }),
      });

      const data: AnkiResponse = await response.json();
      if (data.error) {
        alert('Failed to add note: ' + data.error);
      } else {
        alert('Success!');
      }
    } catch (error) {
      console.error('Failed to communicate with AnkiConnect:', error);
      alert('Failed to communicate with AnkiConnect. Is it running?');
    }
  }
</script>

<style>
  .word-card {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    margin-bottom: 20px;
  }
  .field {
    margin-bottom: 15px;
  }
  .field-label {
    font-weight: 600;
    color: #333;
    margin-bottom: 5px;
  }
  .field-content {
    color: #666;
    line-height: 1.5;
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
</style>

<div class="word-card">
  <div class="field">
    <div class="field-label">Word or Phrase</div>
    <div class="field-content">{wordData?.word ?? ''}</div>
  </div>
  <div class="field">
    <div class="field-label">Pronounce</div>
    <div class="field-content">{wordData?.pronounce ?? ''}</div>
  </div>
  <div class="field">
    <div class="field-label">Definition</div>
    <div class="field-content">{wordData?.definition ?? ''}</div>
  </div>
  <button 
    on:click={addToAnki} 
    disabled={!wordData?.word || !wordData?.definition}
  >
    Add to Anki
  </button>
</div> 