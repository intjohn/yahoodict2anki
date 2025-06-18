import type { AnkiNote, AnkiResponse, AnkiRequestParams } from './anki.type';

export class AnkiConnectionError extends Error {
  constructor(url: string) {
    super(`Failed to connect to Anki on ${url}`);
    this.name = 'AnkiConnectionError';
  }
}

export class AnkiResponseError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnkiResponseError';
  }
}

export class AnkiClient {
  private baseUrl: string;

  constructor(port: number = 8765) {
    this.baseUrl = `http://localhost:${port}`;
  }

  private async invoke<T = string[] | number>(
    action: string,
    params?: AnkiRequestParams
  ): Promise<T> {
    try {
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
        throw new AnkiResponseError(data.error);
      }
      return data.result as T;
    } catch (error) {
      if (error instanceof TypeError) {
        throw new AnkiConnectionError(this.baseUrl);
      }
      throw error;
    }
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
}
