import type { WordData, ContentScriptMessage, AnkiResponse, SidePanelMessageType } from '../types';
import { SidePanelMessage } from '../types';

// Update the side panel content with the word data
const updateContent = (data: WordData | undefined): void => {
  const wordContent = document.querySelector('.word-content');
  const unsupportedMessage = document.querySelector('.unsupported-message');

  if (!data || (!data.word && !data.definition)) {
    wordContent?.classList.remove('visible');
    unsupportedMessage?.classList.add('visible');
    return;
  }

  wordContent?.classList.add('visible');
  unsupportedMessage?.classList.remove('visible');

  const wordElement = document.getElementById('word');
  const pronounceElement = document.getElementById('pronounce');
  const definitionElement = document.getElementById('definition');
  const addButton = document.getElementById('add') as HTMLButtonElement | null;

  if (wordElement) wordElement.textContent = data.word ?? '';
  if (pronounceElement) pronounceElement.textContent = data.pronounce ?? '';
  if (definitionElement) definitionElement.textContent = data.definition ?? '';
  if (addButton) addButton.disabled = !data.word || !data.definition;
};

// Request initial data when side panel opens
const fetchWordData = (): void => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]?.id) {
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: 'GET_WORD_DATA' } as ContentScriptMessage,
        { frameId: 0 },
        updateContent
      );
    }
  });
};

fetchWordData();

// Handle click on "Add to Anki" button
const addButton = document.getElementById('add');
if (addButton) {
  addButton.addEventListener('click', async () => {
    const wordElement = document.getElementById('word');
    const pronounceElement = document.getElementById('pronounce');
    const definitionElement = document.getElementById('definition');

    const word = wordElement?.textContent ?? '';
    const pronounce = pronounceElement?.textContent ?? '';
    const definition = definitionElement?.textContent ?? '';

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
                WordPhrase: word,
                Pronounce: pronounce,
                Definition: definition,
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
  });
}

// Handle side panel to programmatically close
chrome.runtime.onMessage.addListener((message: SidePanelMessageType) => {
  if (message === SidePanelMessage.CloseSidePanel) {
    window.close();
  }
});

// Handle when tab content is reloaded
chrome.runtime.onMessage.addListener((message: SidePanelMessageType) => {
  if (message === SidePanelMessage.ContentReloaded) {
    fetchWordData();
  }
});

// Create liveness connection, that can indicate if the side panel is still open
chrome.runtime.connect({ name: SidePanelMessage.SidePanelAlive });
