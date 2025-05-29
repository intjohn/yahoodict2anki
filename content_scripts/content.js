// Extract word data from the page
function getWordData() {
  const word = document.querySelector('.grp > .compTitle')?.textContent?.trim();
  const pronounce = document.querySelector('.grp > .compList')?.innerText?.trim();
  const definition = document.querySelector('.grp > .compList:last-child')?.innerText?.trim();
  return { word, pronounce, definition };
}

// Serve word data to GET_WORD_DATA requests
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.type === 'GET_WORD_DATA') {
    sendResponse(getWordData());
  }
});
