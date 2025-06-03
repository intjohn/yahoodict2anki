import { SidePanel } from './SidePanel';

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
