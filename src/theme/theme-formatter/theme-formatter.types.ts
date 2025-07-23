import { Granularity } from '@embeddable.com/core';
import { Resource } from 'i18next';
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

export type TextFormatter = {
  /**
   * @param key the lookup key for finding the correct translation template (or a list of keys which will be tried in order)
   * @param params the values that can be used to fill in the placeholders in the translation template
   */
  format: (key: string | string[], params?: TextFormatterParams) => string;
};

export type ThemeFormatter = {
  /**
   * Used to pass in the locale you want to use, and any backups (e.g. ['es-AR', 'es-ES', 'en-US'] or simply ['de-DE'])
   */
  preferredLocales: string[];
  /**
   * Used to add additional translations (e.g. { ...theme.i18n.translations, { es: { ... } } })
   */
  translations: Resource;

  /**
   * Override to customise the default locale logic (by default it will try the `preferredLocales` above in order)
   */
  locale: (theme: Theme) => Intl.Locale;
  /**
   * Override to customise the default dateTime formatter options
   */
  defaultDateTimeFormatOptions: (
    theme: Theme,
    params?: DateTimeFormatterParams,
  ) => Intl.DateTimeFormatOptions;
  /**
   * Override to customise the default number formatter options
   */
  defaultNumberFormatOptions: (
    theme: Theme,
    params?: NumberFormatterParams,
  ) => Intl.NumberFormatOptions;
  /**
   * Override if the format options above aren't enough and you want to fully customise the number formatter
   */
  numberFormatter: (theme: Theme, params?: NumberFormatterParams) => NumberFormatter;
  /**
   * Override if the format options above aren't enough and you want to fully customise the dateTime formatter
   */
  dateTimeFormatter: (theme: Theme, params?: DateTimeFormatterParams) => DateTimeFormatter;
  /**
   * Override if the `translations` above aren't enough and you want to fully customise the text formatter
   */
  textFormatter: (theme: Theme) => TextFormatter;
};
