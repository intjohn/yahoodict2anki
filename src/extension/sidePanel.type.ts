export enum SidePanelMessage {
  CloseSidePanel = 'closeSidePanel',
  ContentReloaded = 'contentReloaded',
  ContentLoading = 'contentLoading',
  SidePanelAlive = 'sidePanelAlive',
}

export type SidePanelStatus = 'open' | 'closed';

export type SidePanelMessageType = SidePanelMessage;
