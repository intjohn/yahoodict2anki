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
