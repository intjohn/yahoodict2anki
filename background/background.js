// Track if the side panel is currently open
let isSidePanelOpen = false;

// Track the active tab that the side panel is open on
let curActiveTabId = null;

// Inject content script into the given tab
const injectContentScript = (tabId, callback) => {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ['content_scripts/content.js'],
    },
    callback
  );
};

// Open the side panel on the given tab
const openSidePanel = (tabId) => {
  // Inject content script to ready the message receiver
  injectContentScript(tabId, () => {
    chrome.sidePanel.open({ tabId });
    curActiveTabId = tabId;
  });
};

// Close the side panel
const closeSidePanel = () => {
  chrome.runtime.sendMessage('closeSidePanel');
};

// Notify side panel to fetch reloaded data
const updateSidePanel = () => {
  chrome.runtime.sendMessage('contentReloaded');
};

// Handle click on extension icon
chrome.action.onClicked.addListener((tab) => {
  if (isSidePanelOpen) {
    closeSidePanel();
  } else {
    openSidePanel(tab.id);
  }
});

// Handle side panel liveness connection
chrome.runtime.onConnect.addListener((port) => {
  if (port.name === 'sidePanelAlive') {
    isSidePanelOpen = true;
    port.onDisconnect.addListener(async () => {
      isSidePanelOpen = false;
    });
  }
});

// Handle tab switch to close side panel
chrome.tabs.onActivated.addListener(async (tab) => {
  if (isSidePanelOpen && curActiveTabId !== tab.id) {
    closeSidePanel();
  }
  curActiveTabId = null;
});

// Handle tab content reload to re-inject content script
chrome.tabs.onUpdated.addListener(async (tabId, changeInfo) => {
  if (changeInfo.status === 'complete' && isSidePanelOpen && curActiveTabId === tabId) {
    injectContentScript(tabId, updateSidePanel);
  }
});
