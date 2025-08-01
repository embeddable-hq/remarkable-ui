import { Granularity } from '@embeddable.com/core';
import { Theme } from '../theme';

export type MeasureMeta = {
  currency?: string;
};

export type DataConfig = {
  maxCharacterLength?: number;
  decimalPlaces?: number;
  prefix?: string;
  suffix?: string;
};

export type DateTimeFormatterParams = {
  granularity?: Granularity;
  shortYear?: boolean;
  shortMonth?: boolean;
};

export type NumberFormatterParams = {
  currency?: string; // e.g. 'USD'
  minDecimalPlaces?: number; // e.g. 0
  maxDecimalPlaces?: number; // e.g. 2
};

export type TextFormatterParams<T = unknown> = { [key: string]: T };

export type NumberFormatter = {
  format: (number: number | bigint) => string;
};

export type DateTimeFormatter = {
  format: (date: Date) => string;
};

export type ThemeFormatter = {
  // Used to pass in the locale you want to use, and any backups (e.g. ['es-AR', 'es-ES', 'en-US'] or simply ['de-DE'])
  locale: string;

  // Override to customise the default locale logic (by default it will try the `preferredLocales` above in order)
  getLocale: (theme: Theme) => Intl.Locale;

  // Override to customise the default dateTime formatter options
  defaultDateTimeFormatOptions: (
    theme: Theme,
    params?: DateTimeFormatterParams,
  ) => Intl.DateTimeFormatOptions;

  // Override to customise the default number formatter options
  defaultNumberFormatOptions: (
    theme: Theme,
    params?: NumberFormatterParams,
  ) => Intl.NumberFormatOptions;

  // Override if the format options above aren't enough and you want to fully customise the number formatter
  numberFormatter: (theme: Theme, params?: NumberFormatterParams) => NumberFormatter;

  // Override if the format options above aren't enough and you want to fully customise the dateTime formatter
  dateTimeFormatter: (theme: Theme, params?: DateTimeFormatterParams) => DateTimeFormatter;
};
