import { SidePanelMessage } from '../types';

// Track if the side panel is currently open
let isSidePanelOpen = false;

// Track the active tab that the side panel is open on
let curActiveTabId: number | null = null;

// Inject content script into the given tab
const injectContentScript = (
  tabId: number,
  callback?: (results: chrome.scripting.InjectionResult<unknown>[]) => void
): void => {
  chrome.scripting.executeScript(
    {
      target: { tabId },
      files: ['content_scripts/content.js'],
    },
    callback as (results: chrome.scripting.InjectionResult<unknown>[]) => void
  );
};

// Open the side panel on the given tab
const openSidePanel = (tabId: number): void => {
  // Inject content script to ready the message receiver
  injectContentScript(tabId, () => {
    chrome.sidePanel.open({ tabId });
    curActiveTabId = tabId;
  });
};

// Close the side panel
const closeSidePanel = (): void => {
  chrome.runtime.sendMessage(SidePanelMessage.CloseSidePanel);
};

// Notify side panel to fetch reloaded data
const updateSidePanel = (): void => {
  chrome.runtime.sendMessage(SidePanelMessage.ContentReloaded);
};

// Handle click on extension icon
chrome.action.onClicked.addListener((tab: chrome.tabs.Tab) => {
  if (isSidePanelOpen) {
    closeSidePanel();
  } else if (tab.id) {
    openSidePanel(tab.id);
  }
});

// Handle side panel liveness connection
chrome.runtime.onConnect.addListener((port: chrome.runtime.Port) => {
  if (port.name === SidePanelMessage.SidePanelAlive) {
    isSidePanelOpen = true;
    port.onDisconnect.addListener(async () => {
      isSidePanelOpen = false;
    });
  }
});

// Handle tab switch to close side panel
chrome.tabs.onActivated.addListener(async (activeInfo: chrome.tabs.TabActiveInfo) => {
  if (isSidePanelOpen && curActiveTabId !== activeInfo.tabId) {
    closeSidePanel();
  }
  curActiveTabId = null;
});

// Handle tab content reload to re-inject content script
chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
  if (changeInfo.status === 'complete' && isSidePanelOpen && curActiveTabId === tabId) {
    injectContentScript(tabId, updateSidePanel);
  }
});
