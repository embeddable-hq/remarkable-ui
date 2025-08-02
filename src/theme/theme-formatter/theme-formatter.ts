import {
  DataConfig,
  DateTimeFormatter,
  DateTimeFormatterParams,
  NumberFormatter,
  NumberFormatterParams,
} from './theme-formatter.types';
import { cache, formatData } from './theme-formatter.utils';
import { DimensionOrMeasure } from '@embeddable.com/core';
import { Theme } from '../theme';

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
