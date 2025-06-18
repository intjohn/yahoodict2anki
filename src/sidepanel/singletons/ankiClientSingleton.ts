import { AnkiClient } from '../../utils/ankiClient/AnkiClient';
import { getOptions } from './optionsSingleton';

let ankiClient: AnkiClient | null = null;

export const getAnkiClient = async (): Promise<AnkiClient> => {
  if (!ankiClient) {
    const options = await getOptions();
    ankiClient = new AnkiClient(options.anki.port);
  }
  return ankiClient;
};
