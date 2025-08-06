import { DimensionOrMeasure, isDimension } from '@embeddable.com/core';
import {
  DataConfig,
  DateTimeFormatter,
  DateTimeFormatterParams,
  MeasureMeta,
  NumberFormatter,
  NumberFormatterParams,
} from './formatter.types';
import { i18n } from '../i18n/i18n';
import { Theme } from '../theme.types';

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
  numberFormatter: (params: NumberFormatterParams) => NumberFormatter,
  dateTimeFormatter: (params: DateTimeFormatterParams) => DateTimeFormatter,
  config?: DataConfig,
) => {
  switch (key.nativeType) {
    // TODO: get types from the SDK
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
  const prefix = isDimension(key) ? 'dimension' : 'measure';

  // Allow translation at 3 levels of abstraction
  return i18n.t(
    [
      `${prefix}.${name}.${value}`, // e.g. 'Dimension.customers.country.Germany': 'Deutschland',
      `${prefix}.${value}`, // e.g. 'Dimension.Germany': 'Germany',
      value, // e.g. 'Germany'
    ],
    {
      value: value,
      type: key.nativeType,
      name: name,
    },
  );
};

export type GetThemeFormatter = {
  /**
   * Formats a number in the currently active locale
   * @example themeFormatter.number(123.45)
   * @example themeFormatter.number(123.45, { currency: 'EUR' })
   */
  number: (value: number | bigint, params?: NumberFormatterParams) => string;
  /**
   * Formats a date in the currently active locale
   * @example themeFormatter.dateTime(new Date(), { granularity: 'week' })
   */
  dateTime: (value: Date, params?: DateTimeFormatterParams) => string;
  /**
   * Formats (or translates) a value returned from `loadData`
   * @example themeFormatter.data(measure, row[measure.name])
   * @example themeFormatter.data(dimension, row[dimension.name])
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: (key: DimensionOrMeasure, value: any, config?: DataConfig) => string;
  /**
   * @returns the currently active locale (e.g. 'en-GB')
   */
  // locale: () => Intl.Locale;
  // locale: string;
  /**
   * @returns the currently active language (e.g. 'en', 'de' or 'es')
   */
  // language: () => string;
};

/**
 * Formatter Helper exists to make it easy to apply standard formatting (and internationalisation) to all components
 */
export const getThemeFormatter = (theme: Theme): GetThemeFormatter => {
  const numberFormatter = cache<NumberFormatterParams, NumberFormatter>((params) =>
    theme.formatter.numberFormatter(theme, params),
  );
  const dateTimeFormatter = cache<DateTimeFormatterParams, DateTimeFormatter>((params) =>
    theme.formatter.dateTimeFormatter(theme, params),
  );

  return {
    number: (value: number | bigint, params?: NumberFormatterParams): string => {
      return numberFormatter(params).format(value);
    },
    dateTime: (value: Date, params?: DateTimeFormatterParams): string => {
      return dateTimeFormatter(params).format(value);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: (key: DimensionOrMeasure, value: any, config?: DataConfig): string => {
      const result = formatData(key, value, numberFormatter, dateTimeFormatter, config);
      // Add prefix and suffix
      const appended = `${config?.prefix || ''}${result}${config?.suffix || ''}`;
      // Trim to max character length
      const ellipsis = '...';
      if (
        config?.maxCharacterLength &&
        config?.maxCharacterLength > ellipsis.length &&
        appended.length > config.maxCharacterLength
      ) {
        return appended.substring(0, config?.maxCharacterLength - ellipsis.length) + ellipsis;
      }
      return appended;
    },
  };
};
