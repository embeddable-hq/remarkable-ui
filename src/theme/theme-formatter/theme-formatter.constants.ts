import {
  DateTimeFormatter,
  DateTimeFormatterParams,
  ThemeFormatter,
  NumberFormatter,
  NumberFormatterParams,
} from './theme-formatter.types';
import { Theme } from '../theme';
import { i18n } from '../i18n';

const getLocale = (locale: string) => {
  try {
    return new Intl.Locale(locale);
  } catch {
    return new Intl.Locale('en-US');
  }
};

export const defaultThemeFormatter: ThemeFormatter = {
  locale: navigator.language,

  defaultDateTimeFormatOptions: (
    _theme: Theme,
    params?: DateTimeFormatterParams,
  ): Intl.DateTimeFormatOptions => {
    return {
      year: params?.shortYear ? '2-digit' : 'numeric',
      month: params?.shortMonth ? '2-digit' : 'short',
      day: params?.shortMonth ? '2-digit' : 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    };
  },
  defaultNumberFormatOptions: (
    _theme: Theme,
    params?: NumberFormatterParams,
  ): Intl.NumberFormatOptions => {
    return {
      style: params?.currency ? 'currency' : undefined,
      currency: params?.currency,
      minimumFractionDigits: params?.minDecimalPlaces || 0,
      maximumFractionDigits: params?.maxDecimalPlaces || 2,
    };
  },
  numberFormatter: (theme: Theme, params?: NumberFormatterParams): NumberFormatter => {
    const locale = getLocale(theme.formatter.locale);

    const formatter = new Intl.NumberFormat(
      locale,
      theme.formatter.defaultNumberFormatOptions(theme, params),
    );
    return { format: (number: number | bigint) => formatter.format(number) };
  },
  dateTimeFormatter: (theme: Theme, params?: DateTimeFormatterParams): DateTimeFormatter => {
    const locale = getLocale(theme.formatter.locale);
    const { year, month, day, hour, minute, second } = theme.formatter.defaultDateTimeFormatOptions(
      theme,
      params,
    );
    if (!params?.granularity) {
      return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
    }

    // NOTE: SDK export the granularity options
    switch (params.granularity) {
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
      case 'minute':
      case 'second':
        return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
    }
  },
};
