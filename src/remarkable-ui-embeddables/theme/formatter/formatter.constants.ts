import {
  ThemeFormatter,
  NumberFormatter,
  DateTimeFormatter,
  StringFormatter,
} from './formatter.types';
import { Theme } from '../theme.types';
import { DimensionOrMeasure, isDimension } from '@embeddable.com/core';
import { i18n, i18nSetup } from '../i18n/i18n';

const getLocale = (locale: string) => {
  try {
    return new Intl.Locale(locale);
  } catch {
    return new Intl.Locale('en-US');
  }
};

const isValidCurrency = (code: string): boolean => {
  try {
    new Intl.NumberFormat('en', {
      style: 'currency',
      currency: code,
    });
    return true;
  } catch {
    return false;
  }
};

const defaultNumberFormatterOptions: Intl.NumberFormatOptions = {};

const numberFormatter = (
  theme: Theme,
  options: Intl.NumberFormatOptions = theme.formatter.defaultNumberFormatterOptions,
): NumberFormatter => {
  const locale = getLocale(theme.formatter.locale);

  const currency = options?.currency;

  if (currency && !isValidCurrency(currency)) {
    return {
      format: (value: number | bigint): string =>
        `${Intl.NumberFormat(locale, { ...options, currency: undefined, style: undefined }).format(value)} ${currency}`,
    };
  }

  return {
    format: Intl.NumberFormat(locale, options ?? theme.formatter.defaultNumberFormatterOptions)
      .format,
  };
};

const dataNumberFormatter = (theme: Theme, key: DimensionOrMeasure): NumberFormatter => {
  const currency = key.inputs?.currency;

  const options: Intl.NumberFormatOptions = {
    style: currency ? 'currency' : undefined,
    currency: currency ? currency : undefined,
    notation: key.inputs?.abbreviateLargeNumber ? 'compact' : undefined,
    maximumFractionDigits: key.inputs?.decimalPlaces ?? 0,
  };

  return theme.formatter.numberFormatter(theme, options);
};

const defaultDateTimeFormatOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

const dateTimeFormatter = (theme: Theme): DateTimeFormatter => {
  const locale = getLocale(theme.formatter.locale);
  const { year, month, day, hour, minute, second } = theme.formatter.defaultDateTimeFormatOptions;
  return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
};

const dataDateTimeFormatter = (theme: Theme, key: DimensionOrMeasure): DateTimeFormatter => {
  i18nSetup(theme);

  const locale = getLocale(theme.formatter.locale);

  if (!key.inputs?.granularity) {
    return theme.formatter.dateTimeFormatter(theme);
  }

  const { year, month, day, hour, minute, second } = theme.formatter.defaultDateTimeFormatOptions;

  switch (key.inputs?.granularity) {
    case 'year':
      return new Intl.DateTimeFormat(locale, { year });
    case 'quarter': {
      return {
        format: (date: Date): string => {
          return i18n.t('granularity.quarter', {
            quarter: Math.floor(date.getMonth() / 3) + 1,
            year: date.getFullYear(),
          });
        },
      };
    }
    case 'month':
      return new Intl.DateTimeFormat(locale, { year, month });
    case 'week':
    case 'day':
      return new Intl.DateTimeFormat(locale, { year, month, day });
    case 'hour':
      return new Intl.DateTimeFormat(locale, { year, month, day, hour });
    case 'minute':
      return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute });
    case 'second':
    default:
      return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
  }
};

const dataOthersFormatter = (theme: Theme, key: DimensionOrMeasure): StringFormatter => {
  i18nSetup(theme);

  const name = key.name;
  const prefix = isDimension(key) ? 'dimension' : 'measure';

  return {
    format: (value: string) =>
      i18n.t(
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
      ),
  };
};

export const defaultThemeFormatter: ThemeFormatter = {
  locale: navigator.language,

  defaultNumberFormatterOptions,
  defaultDateTimeFormatOptions,

  numberFormatter,
  dateTimeFormatter,

  dataNumberFormatter,
  dataDateTimeFormatter,
  dataOthersFormatter,
};
