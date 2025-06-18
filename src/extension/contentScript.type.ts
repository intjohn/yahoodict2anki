import type { WordData } from '../wordData';

export interface ContentScriptMessage {
  type: 'GET_WORD_DATA';
  data?: WordData;
}
