import { SidePanelMessage, WorkerMessage } from '../extension';

type SidePanelStatus = 'open' | 'closed' | 'pending';

export class SidePanel {
  private static status: SidePanelStatus = 'closed';
  private static currentHost: string | null;

  /**
   * Toggles the side panel
   * @param tabId - The tab ID to toggle the side panel for
   */
  public static toggle(tab: chrome.tabs.Tab): void {
    if (SidePanel.status === 'open') {
      return SidePanel.close();
    }
    if (SidePanel.status === 'closed') {
      return SidePanel.open(tab);
    }
  }

  /**
   * Updates the side panel upon tab content reloaded
   * @param tabId - The tab ID to update the side panel for
   */
  public static update(tabId: number): void {
    if (SidePanel.status !== 'open') {
      return;
    }
    chrome.tabs.get(tabId, (tab) => {
      if (tab.status === 'complete') {
        SidePanel.injectContentScript(tabId, () => {
          SidePanel.notifyContentChanged();
        });
      }
    });
  }

  public static loading(tabUrl: string | undefined): void {
    if (SidePanel.status === 'open') {
      if (typeof tabUrl === 'undefined' || new URL(tabUrl).hostname === SidePanel.currentHost) {
        chrome.runtime.sendMessage(SidePanelMessage.ContentLoading);
      } else {
        SidePanel.close();
      }
    }
  }

  /**
   * Signal the side panel to close
   */
  public static close(): void {
    if (SidePanel.status !== 'open') {
      return;
    }
    SidePanel.status = 'pending';
    chrome.runtime.sendMessage(SidePanelMessage.CloseSidePanel);
  }

  /**
   * Open the side panel with necessary content script injected
   * @param tabId - The tab ID to open the side panel for
   */
  private static open(tab: chrome.tabs.Tab): void {
    if (tab.id) {
      const tabId = tab.id;
      SidePanel.status = 'pending';
      SidePanel.currentHost = tab.url ? new URL(tab.url).hostname : '';
      SidePanel.setupLivenessConnection();
      if (SidePanel.isRestricted(tab)) {
        chrome.sidePanel.open({ tabId });
      } else {
        SidePanel.injectContentScript(tabId, () => {
          chrome.sidePanel.open({ tabId });
        });
      }
    }
  }

  /**
   * Signal the side panel to fetch word data from the newest content
   */
  private static notifyContentChanged(): void {
    chrome.runtime.sendMessage(SidePanelMessage.ContentReloaded);
  }

  /**
   * Injects the content script into the tab
   * @param callback - The callback to call when the content script is injected
   */
  private static injectContentScript(
    tabId: number,
    callback: (results: chrome.scripting.InjectionResult<unknown>[]) => void
  ): void {
    chrome.scripting.executeScript(
      {
        target: { tabId },
        files: ['content_scripts/content.js'],
      },
      callback
    );
  }

  /**
   * Sets up the liveness connection to track side panel state
   */
  private static setupLivenessConnection(): void {
    if (!chrome.runtime.onConnect.hasListener(SidePanel.handleSidePanelConnection)) {
      chrome.runtime.onConnect.addListener(SidePanel.handleSidePanelConnection);
    }
  }

  /**
   * Handles the side panel connection
   * @param port - An object containing info about the incoming connection
   */
  private static handleSidePanelConnection(port: chrome.runtime.Port): void {
    if (port.name === WorkerMessage.SidePanelAlive) {
      SidePanel.status = 'open';
      
      port.onDisconnect.addListener(() => {
        SidePanel.status = 'closed';
        SidePanel.currentHost = null;
      });
    }
  }

  /**
   * Checks if the tab is restricted
   * @param tab - The tab to check
   * @returns True if the tab is restricted, false otherwise
   */
  private static isRestricted(tab: chrome.tabs.Tab): boolean {
    return tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://') || false;
  }
}
