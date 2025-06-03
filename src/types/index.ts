export interface WordData {
  word: string | undefined;
  pronounce: string | undefined;
  definition: string | undefined;
}

export interface AnkiResponse {
  error?: string;
  result?: number | string[] | string[];
}

export interface ContentScriptMessage {
  type: 'GET_WORD_DATA';
  data?: WordData;
}

export enum SidePanelMessage {
  CloseSidePanel = 'closeSidePanel',
  ContentReloaded = 'contentReloaded',
  ContentLoading = 'contentLoading',
  SidePanelAlive = 'sidePanelAlive',
}

export type SidePanelStatus = 'open' | 'closed';

export type SidePanelMessageType = SidePanelMessage;

export const BackgroundMessage = {
  OptionsChanged: 'optionsChanged',
} as const;

export type BackgroundMessageType = (typeof BackgroundMessage)[keyof typeof BackgroundMessage];

export interface ExtensionOptions {
  ankiConnectPort: number;
}

export const defaultOptions: ExtensionOptions = {
  ankiConnectPort: 8765,
};
