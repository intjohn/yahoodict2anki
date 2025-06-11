import { SidePanel } from './SidePanel';

// Create context menu item
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: 'lookup-yahoo-dict',
    title: 'Lookup "%s" in Yahoo Dictionary',
    contexts: ['selection'],
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info: chrome.contextMenus.OnClickData) => {
  if (info.menuItemId === 'lookup-yahoo-dict' && info.selectionText) {
    const yahooUrl = `https://tw.dictionary.search.yahoo.com/search?p=${encodeURIComponent(info.selectionText)}`;
    chrome.tabs.create({ url: yahooUrl });
  }
});

// Handle click on extension icon
chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  SidePanel.toggle(tab);
});

// Handle tab switch
chrome.tabs.onActivated.addListener(() => {
  SidePanel.close();
});

// Handle tab content reload
chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
  // Notify when page starts loading
  if (changeInfo.status === 'loading') {
    SidePanel.loading(changeInfo.url);
  }
  // Notify when page completes loading
  else if (changeInfo.status === 'complete') {
    SidePanel.update(tabId);
  }
});
