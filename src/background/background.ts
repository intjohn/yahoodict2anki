import { SidePanel } from './SidePanel';

// Handle click on extension icon
chrome.action.onClicked.addListener(async (tab: chrome.tabs.Tab) => {
  if (tab.id) {
    SidePanel.toggle(tab.id);
  }
});

// Handle tab switch
chrome.tabs.onActivated.addListener(async (activeInfo: chrome.tabs.TabActiveInfo) => {
  SidePanel.close();
});

// Handle tab content reload
chrome.tabs.onUpdated.addListener(async (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
  if (changeInfo.status === 'complete') {
    SidePanel.update(tabId);
  }
});
