import type { WordData, ContentScriptMessage } from '../types';

function encode(html: string): string {
  const text = document.createTextNode(html);
  const p = document.createElement('p');
  p.appendChild(text);
  return p.innerHTML;
}

// Extract word data from the page
function getWordData(): WordData {
  const word = encode(document.querySelector('.grp > .compTitle')?.textContent?.trim() || '');
  let pronounce = '';
  let definitionNode;
  const contentList = document.querySelectorAll('.grp > .compList');

  if (contentList.length > 1) {
    pronounce = encode(contentList[0].textContent?.trim() || '');
    definitionNode = contentList[1];
  } else {
    definitionNode = contentList[0];
  }
  const definition = [...definitionNode.querySelectorAll('li')]
    .map((li) => encode(li.textContent?.trim() || ''))
    .join('<br>');
  return { word, pronounce, definition };
}

// Serve word data to GET_WORD_DATA requests
chrome.runtime.onMessage.addListener(
  (
    request: ContentScriptMessage,
    _sender: chrome.runtime.MessageSender,
    sendResponse: (_response: WordData) => void
  ) => {
    if (request.type === 'GET_WORD_DATA') {
      sendResponse(getWordData());
    }
  }
);
