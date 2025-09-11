import { DimensionOrMeasure } from '@embeddable.com/core';
import { DateTimeFormatter, NumberFormatter, StringFormatter } from './formatter.types';
import { Theme } from '../theme.types';
import { cache } from '../../utils.ts/cache.utils';
import { isValidISODate } from '../../utils.ts/data.utils';
import { resolveI18nString } from '../../components/component.utils';

export type GetThemeFormatter = {
  string: (key: string) => string;
  number: (value: number | bigint, options?: Intl.NumberFormatOptions) => string;
  dateTime: (value: Date, options?: Intl.DateTimeFormatOptions) => string;
  dimensionOrMeasureTitle: (key: DimensionOrMeasure) => string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: (key: DimensionOrMeasure, value: any) => string;
};

export const getThemeFormatter = (theme: Theme): GetThemeFormatter => {
  const cachedNumberFormatter = cache<Intl.NumberFormatOptions, NumberFormatter>((options) =>
    theme.formatter.numberFormatter(theme, options),
  );

  const cachedDataNumberFormatter = cache<DimensionOrMeasure, NumberFormatter>((key) =>
    theme.formatter.dataNumberFormatter(theme, key!),
  );

  const cachedDateTimeFormatter = cache<Intl.DateTimeFormatOptions, DateTimeFormatter>((options) =>
    theme.formatter.dateTimeFormatter(theme, options),
  );

  const cachedDataDateTimeFormatter = cache<DimensionOrMeasure, DateTimeFormatter>((key) =>
    theme.formatter.dataDateTimeFormatter(theme, key!),
  );

  const cachedDataOthersFormatter = cache<DimensionOrMeasure, StringFormatter>((key) =>
    theme.formatter.dataOthersFormatter(theme, key!),
  );

  return {
    string: (key: string) => theme.formatter.stringFormatter().format(key),
    number: (value: number | bigint, options?: Intl.NumberFormatOptions): string => {
      return cachedNumberFormatter(options).format(value);
    },
    dateTime: (value: Date, options?: Intl.DateTimeFormatOptions): string => {
      return cachedDateTimeFormatter(options).format(value);
    },
    dimensionOrMeasureTitle: (key: DimensionOrMeasure): string => {
      const displayName = key.inputs?.displayName;
      if (displayName) {
        if (displayName.includes('|')) {
          return resolveI18nString(displayName);
        }
        return displayName;
      }

      const resolved = cachedDataOthersFormatter(key).format(key.name);
      return resolved === key.name ? (key.title ?? key.name) : resolved;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: (key: DimensionOrMeasure, value: any): string => {
      let newValue = value;

      // Number
      if (key.nativeType === 'number') {
        newValue = cachedDataNumberFormatter(key).format(value);
      }

      // Time
      if (key.nativeType === 'time' && isValidISODate(value)) {
        newValue = cachedDataDateTimeFormatter(key).format(new Date(value));
      }

      // Others (boolean and string)
      if (key.nativeType === 'boolean' || key.nativeType === 'string') {
        newValue = cachedDataOthersFormatter(key).format(value);
      }

      // Prefix and suffix
      const appended = `${key.inputs?.prefix || ''}${newValue}${key.inputs?.suffix || ''}`;

      // Max characters
      if (key.inputs?.maxCharacters) {
        if (appended.length <= key.inputs.maxCharacters) {
          return appended;
        }
        return appended.substring(0, key.inputs.maxCharacters) + '...';
      }

      return appended;
    },
  };
};
