import { Theme } from 'theme';
import {
  DateTimeFormatter,
  DateTimeFormatterParams,
  ThemeFormatter,
  NumberFormatter,
  NumberFormatterParams,
  TextFormatter,
  TextFormatterParams,
} from './theme-formatter.types';
import { de } from './theme-formatter-translations/de';
import { en } from './theme-formatter-translations/en';
import i18next from 'i18next';

export const themeFormatter: ThemeFormatter = {
  preferredLocales: [navigator.language],
  translations: {
    en,
    de,
  },
  locale: (theme: Theme) => {
    for (const locale of theme.formatter.preferredLocales) {
      try {
        return new Intl.Locale(locale);
      } catch {
        // Not supported in current browser
      }
    }
    return new Intl.Locale('en-US'); // Fallback to en-US which should work everywhere
  },
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
    const formatter = new Intl.NumberFormat(
      theme.formatter.locale(theme),
      theme.formatter.defaultNumberFormatOptions(theme, params),
    );
    return { format: (number: number | bigint) => formatter.format(number) };
  },
  dateTimeFormatter: (theme: Theme, params?: DateTimeFormatterParams): DateTimeFormatter => {
    const { formatter } = theme;
    const locale = formatter.locale(theme);
    const { year, month, day, hour, minute, second } = formatter.defaultDateTimeFormatOptions(
      theme,
      params,
    );
    if (!params?.granularity) {
      return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
    }
    switch (params.granularity) {
      case 'year':
        return new Intl.DateTimeFormat(locale, { year });
      case 'quarter': {
        const textFormatter = formatter.textFormatter(theme);
        return {
          format: (date: Date): string => {
            return textFormatter.format('Granularity.quarter', {
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
  textFormatter: (theme: Theme): TextFormatter => {
    const { locale, translations } = theme.formatter;
    const instance = i18next.createInstance();
    instance.init({
      lng: locale(theme).language,
      resources: translations,
    });
    return {
      format: (key: string | string[], params?: TextFormatterParams) => {
        return instance.t(key, params);
      },
    };
  },
};
