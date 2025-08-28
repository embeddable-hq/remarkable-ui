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
