import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Theme } from '../theme/theme.types';
import { useTheme } from '@embeddable.com/react';

export const loadDayjsLocale = async (locale: string) => {
  try {
    await import(`dayjs/locale/${locale}.js`);
    dayjs.locale(locale);
  } catch {
    console.warn(`Locale "${locale}" not found, falling back to en.`);
    dayjs.locale('en');
  }
};

export const useLoadDayjsLocale = () => {
  const theme: Theme = useTheme() as Theme;
  const [dayjsLocalReady, setDayjsLocaleReady] = useState(false);

  useEffect(() => {
    const loadLocale = async () => {
      setDayjsLocaleReady(false);
      loadDayjsLocale(theme.formatter.locale);
      setDayjsLocaleReady(true);
    };

    loadLocale();
  }, [theme.formatter.locale]);

  return { dayjsLocalReady };
};

export const localToUtcDate = (date: Date): Date => {
  // getTimezoneOffset() is “minutes to add to local → UTC”
  const offsetMs = date.getTimezoneOffset() * 60_000;
  // subtracting that offset “undoes” the browser’s shift
  return new Date(date.getTime() - offsetMs);
};

export const utcToLocalDate = (date: Date): Date => {
  // getTimezoneOffset() is “minutes to add to local → UTC”
  const offsetMs = date.getTimezoneOffset() * 60_000;
  // adding the offset “restores” local time
  return new Date(date.getTime() + offsetMs);
};
