import { DimensionOrMeasure, isDimension } from '@embeddable.com/core';
import {
  DataConfig,
  DateTimeFormatter,
  DateTimeFormatterParams,
  MeasureMeta,
  NumberFormatter,
  NumberFormatterParams,
  TextFormatter,
} from './theme-formatter.types';

/**
 * Creates a formatter cache.
 * Cache used to prevent unnecessary (expensive) creation of formatter objects
 */
export const cache = <Params, Formatter>(factory: (params?: Params) => Formatter) => {
  const cache: { [key: string]: Formatter } = {};
  const get = (params?: Params) => {
    const key = JSON.stringify(params);
    let formatter = cache[key];
    if (formatter) {
      return formatter;
    }
    formatter = factory(params);
    cache[key] = formatter;
    return formatter;
  };
  return get;
};

const ISO_DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/;

export const formatData = (
  key: DimensionOrMeasure,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any,
  textFormatter: TextFormatter,
  numberFormatter: (params: NumberFormatterParams) => NumberFormatter,
  dateTimeFormatter: (params: DateTimeFormatterParams) => DateTimeFormatter,
  config?: DataConfig,
) => {
  const prefix = isDimension(key) ? 'Dimension' : 'Measure';
  switch (key.nativeType) {
    case 'number': {
      const params: NumberFormatterParams = {
        maxDecimalPlaces: config?.decimalPlaces,
        minDecimalPlaces: config?.decimalPlaces,
      };
      if ((key?.meta as MeasureMeta)?.currency) {
        // Currency
        return numberFormatter({
          ...params,
          currency: (key.meta as MeasureMeta).currency,
        }).format(value);
      }
      // Number
      return numberFormatter(params).format(value);
    }
    case 'time': {
      if (value && ISO_DATE_TIME_REGEX.test(value)) {
        // Date time
        return dateTimeFormatter({ granularity: key.inputs?.granularity, shortMonth: true }).format(
          new Date(value),
        );
      }
      // Fall through to string formatting for non-ISO time values
      break;
    }
    case 'boolean':
      // Fall through to string formatting for booleans
      break;
  }
  // String
  const name = key.name;
  // Allow translation at 3 levels of abstraction
  const keys = [
    `${prefix}.${name}.${value}`, // e.g. 'Dimension.customers.country.Germany': 'Deutschland',
    `${prefix}.${name}`, // e.g. 'Dimension.customers.country': 'Country is {{value}}',
    `${prefix}`, // e.g. Dimension: '{{value}}',
  ];
  return textFormatter.format(keys, { value: value, type: key.nativeType, name: name });
};
