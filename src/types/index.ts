export interface WordData {
  word: string | undefined;
  pronounce: string | undefined;
  definition: string | undefined;
}

export interface AnkiResponse {
  error?: string;
  result?: number;
}

export interface ContentScriptMessage {
  type: 'GET_WORD_DATA';
  data?: WordData;
}

export const SidePanelMessage = {
  CloseSidePanel: 'closeSidePanel',
  ContentReloaded: 'contentReloaded',
  SidePanelAlive: 'sidePanelAlive'
} as const;

export type SidePanelMessageType = typeof SidePanelMessage[keyof typeof SidePanelMessage];

export const BackgroundMessage = {
  OptionsChanged: 'optionsChanged',
} as const;

export type BackgroundMessageType = typeof BackgroundMessage[keyof typeof BackgroundMessage];

export interface ExtensionOptions {
  ankiConnectPort: number;
}

export const defaultOptions: ExtensionOptions = {
  ankiConnectPort: 8765,
};
