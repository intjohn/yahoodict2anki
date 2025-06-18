interface AnkiNoteFields {
  [key: string]: string;
}

export interface AnkiNote {
  deckName: string;
  modelName: string;
  fields: AnkiNoteFields;
  options?: {
    allowDuplicate?: boolean;
    duplicateScope?: string;
  };
  tags?: string[];
}

export type AnkiRequestParams = {
  [key: string]: string | AnkiNote;
};

export interface AnkiResponse {
  error?: string;
  result?: number | string[] | string[];
}
