let word = '';
let pronounce = '';
let definition = '';

document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_WORD_DATA' }, undefined, (response) => {
      if (response) {
        console.log(response);
        ({word, pronounce, definition} = response);
        document.getElementById('word').textContent = word;
        document.getElementById('pronounce').textContent = pronounce;
        document.getElementById('definition').textContent = definition;
        document.getElementById('add').disabled = false;
      }
    });
  });

  document.getElementById('add').addEventListener('click', () => {
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
    }).then(res => res.json())
      .then(data => {
        if (data.error) {
          alert('Failed to add note: ' + data.error);
        } else {
          alert('Success!');
        }
      });
  });
});
