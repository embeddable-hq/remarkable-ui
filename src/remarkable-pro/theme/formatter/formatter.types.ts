import { DimensionOrMeasure } from '@embeddable.com/core';
import { Theme } from '../theme.types';

export type Formatter<T> = {
  format: (value: T) => string;
};

export type NumberFormatter = Formatter<number | bigint>;
export type DateTimeFormatter = Formatter<Date>;
export type StringFormatter = Formatter<string>;

export type ThemeFormatter = {
  locale: string;

  // Default formatter options
  defaultNumberFormatterOptions: Intl.NumberFormatOptions;
  defaultDateTimeFormatOptions: Intl.DateTimeFormatOptions;

  // Default formatters
  stringFormatter: () => StringFormatter;
  numberFormatter: (theme: Theme, options?: Intl.NumberFormatOptions) => NumberFormatter;
  dateTimeFormatter: (theme: Theme, options?: Intl.DateTimeFormatOptions) => DateTimeFormatter;

  // Formatter data for dimensions and measures
  dataNumberFormatter: (theme: Theme, key: DimensionOrMeasure) => NumberFormatter;
  dataDateTimeFormatter: (theme: Theme, key: DimensionOrMeasure) => DateTimeFormatter;
  dataOthersFormatter: (theme: Theme, key: DimensionOrMeasure) => StringFormatter;
};
