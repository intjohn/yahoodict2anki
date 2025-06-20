export enum SidePanelMessage {
  CloseSidePanel = 'closeSidePanel',
  ContentReloaded = 'contentReloaded',
  ContentLoading = 'contentLoading',
}

export type SidePanelStatus = 'open' | 'closed';

export type SidePanelMessageType = SidePanelMessage;
