// Update the side panel content with the word data
const updateContent = (data) => {
  console.debug('Received word data:', data);

  const { word, pronounce, definition } = data;

  document.getElementById('word').textContent = word;
  document.getElementById('pronounce').textContent = pronounce;
  document.getElementById('definition').textContent = definition;
  document.getElementById('add').disabled = !word || !definition;
}

// Request initial data when side panel opens
const fetchWordData = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_WORD_DATA' }, undefined, updateContent);
    }
  });
};

fetchWordData();

// Handle click on "Add to Anki" button
document.getElementById('add').addEventListener('click', () => {
  const word = document.getElementById('word').textContent;
  const pronounce = document.getElementById('pronounce').textContent;
  const definition = document.getElementById('definition').textContent;

  fetch('http://localhost:8765', {
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
            Definition: definition
          },
          options: {
            allowDuplicate: false
          },
          tags: ['yahoo2anki']
        }
      }
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.error) {
      alert('Failed to add note: ' + data.error);
    } else {
      alert('Success!');
    }
  });
}); 

// Handle side panel to programmatically close
chrome.runtime.onMessage.addListener(message => {
  if (message === 'closeSidePanel') {
    window.close();
  }
});

// Handle when tab content is reloaded
chrome.runtime.onMessage.addListener((message) => {
  if (message === 'contentReloaded') {
    fetchWordData();
  }
});

// Create liveness connection, that can indicate if the side panel is still open
chrome.runtime.connect({ name: 'sidePanelAlive' });
