import { yahooFields, type YahooDataField } from './yahooFields';

type YahooWordData = {
  [key in YahooDataField]: string;
};

type WordData = YahooWordData;

export { yahooFields, type WordData, type YahooDataField };
