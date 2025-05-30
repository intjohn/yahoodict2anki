import type { WordData, ContentScriptMessage } from '../types';

// Extract word data from the page
function getWordData(): WordData {
  const word = document.querySelector('.grp > .compTitle')?.textContent?.trim();
  const pronounce = document.querySelector('.grp > .compList')?.textContent?.trim();
  const definition = document.querySelector('.grp > .compList:last-child')?.textContent?.trim();
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
