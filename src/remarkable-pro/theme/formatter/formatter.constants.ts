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

const isValidCurrency = (locale: Intl.LocalesArgument, code: string): boolean => {
  try {
    new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: code,
    });
    return true;
  } catch {
    return false;
  }
};

const stringFormatter = (): StringFormatter => {
  return {
    format: (key: string): string => i18n.t(key),
  };
};

const defaultNumberFormatterOptions: Intl.NumberFormatOptions = {};

const numberFormatter = (
  theme: Theme,
  options: Intl.NumberFormatOptions = theme.formatter.defaultNumberFormatterOptions,
): NumberFormatter => {
  const locale = getLocale(theme.formatter.locale);

  const currency = options?.currency;

  if (currency && !isValidCurrency(locale, currency)) {
    return {
      format: (value: number | bigint): string =>
        `${currency} ${Intl.NumberFormat(locale, { ...options, currency: undefined, style: undefined }).format(value)}`,
    };
  }

  return {
    format: Intl.NumberFormat(locale, options ?? theme.formatter.defaultNumberFormatterOptions)
      .format,
  };
};

const dataNumberFormatter = (theme: Theme, key: DimensionOrMeasure): NumberFormatter => {
  const currency = key.inputs?.currency;
  const decimalPlaces = key.inputs?.decimalPlaces;
  const hasDecimalPlaces = decimalPlaces != null;

  const fixedFractionDigits = hasDecimalPlaces ? decimalPlaces : undefined;

  const options: Intl.NumberFormatOptions = {
    style: currency ? 'currency' : undefined,
    currency: currency ? currency : undefined,
    notation: key.inputs?.abbreviateLargeNumber ? 'compact' : undefined,
    minimumFractionDigits: fixedFractionDigits,
    maximumFractionDigits: fixedFractionDigits,
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

const dateTimeFormatter = (
  theme: Theme,
  options?: Intl.DateTimeFormatOptions,
): DateTimeFormatter => {
  const locale = getLocale(theme.formatter.locale);
  const { year, month, day, hour, minute, second } =
    options ?? theme.formatter.defaultDateTimeFormatOptions;
  return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
};

const dataDateTimeFormatter = (theme: Theme, key: DimensionOrMeasure): DateTimeFormatter => {
  i18nSetup(theme);

  const locale = getLocale(theme.formatter.locale);

  const granularity = key.inputs?.granularity;

  const { year, month, day, hour, minute, second } = theme.formatter.defaultDateTimeFormatOptions;

  // TODO: Update SDK to export the needed constants for the granularity
  switch (granularity) {
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
    format: (value: string) => {
      if (value == null) {
        return '';
      }

      const stringValue = value.toString();

      return i18n.t(
        [
          `${prefix}.${name}.${stringValue}`, // e.g. 'Dimension.customers.country.Germany': 'Deutschland',
          `${prefix}.${stringValue}`, // e.g. 'Dimension.Germany': 'Germany',
          stringValue, // e.g. 'Germany'
        ],
        {
          value: stringValue,
          type: key.nativeType,
          name: name,
        },
      );
    },
  };
};

export const remarkableThemeFormatter: ThemeFormatter = {
  locale: navigator.language,

  defaultNumberFormatterOptions,
  defaultDateTimeFormatOptions,

  stringFormatter,
  numberFormatter,
  dateTimeFormatter,

  dataNumberFormatter,
  dataDateTimeFormatter,
  dataOthersFormatter,
};
