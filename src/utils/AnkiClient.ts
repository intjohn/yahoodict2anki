import type { AnkiResponse, WordData } from '../types';

export interface AnkiFields {
  [key: string]: string;
}

export interface AnkiNote {
  deckName: string;
  modelName: string;
  fields: AnkiFields;
  options?: {
    allowDuplicate?: boolean;
    duplicateScope?: string;
  };
  tags?: string[];
}

export class AnkiClient {
  private baseUrl: string;

  constructor(port: number = 8765) {
    this.baseUrl = `http://localhost:${port}`;
  }

  private async invoke<T = string[] | number>(action: string, params?: any): Promise<T> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify({
        action,
        version: 6,
        params,
      }),
    });

    const data: AnkiResponse = await response.json();
    if (data.error) {
      throw new Error(data.error);
    }
    return data.result as T;
  }

  /**
   * Get all available deck names
   */
  async getDeckNames(): Promise<string[]> {
    const result = await this.invoke<string[]>('deckNames');
    return result || [];
  }

  /**
   * Get all available model (note type) names
   */
  async getModelNames(): Promise<string[]> {
    const result = await this.invoke<string[]>('modelNames');
    return result || [];
  }

  /**
   * Get field names for a specific model
   */
  async getModelFieldNames(modelName: string): Promise<string[]> {
    const result = await this.invoke<string[]>('modelFieldNames', { modelName });
    return result || [];
  }

  /**
   * Add a note to Anki
   */
  async addNote(note: AnkiNote): Promise<number> {
    const result = await this.invoke<number>('addNote', { note });
    return result;
  }

  /**
   * Create field mappings based on model fields
   */
  createFieldMappings(modelFields: string[]): { [key: string]: string } {
    const mappings: { [key: string]: string } = {};
    modelFields.forEach((field) => {
      const fieldLower = field.toLowerCase();
      if (fieldLower.includes('word') || fieldLower.includes('phrase')) {
        mappings[field] = 'word';
      } else if (fieldLower.includes('pronounce')) {
        mappings[field] = 'pronounce';
      } else if (fieldLower.includes('definition') || fieldLower.includes('meaning')) {
        mappings[field] = 'definition';
      }
    });
    return mappings;
  }

  /**
   * Create note fields from word data and field mappings
   */
  createNoteFields(wordData: WordData, fieldMappings: { [key: string]: string }): AnkiFields {
    const fields: AnkiFields = {};
    Object.entries(fieldMappings).forEach(([ankiField, dataField]) => {
      fields[ankiField] = wordData?.[dataField as keyof WordData] ?? '';
    });
    return fields;
  }
}
