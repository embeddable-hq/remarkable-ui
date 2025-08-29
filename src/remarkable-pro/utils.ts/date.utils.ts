import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { Theme } from '../theme/theme.types';
import { useTheme } from '@embeddable.com/react';

// Dayjs locales dynamic imports
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const locales: Record<string, () => Promise<any>> = {
  en: () => import('dayjs/locale/en'),
  'en-gb': () => import('dayjs/locale/en-gb'),
  es: () => import('dayjs/locale/es'),
  fr: () => import('dayjs/locale/fr'),
  de: () => import('dayjs/locale/de'),
  it: () => import('dayjs/locale/it'),
  pt: () => import('dayjs/locale/pt'),
  'pt-br': () => import('dayjs/locale/pt-br'),
  nl: () => import('dayjs/locale/nl'),
  ru: () => import('dayjs/locale/ru'),
  'zh-cn': () => import('dayjs/locale/zh-cn'),
  'zh-tw': () => import('dayjs/locale/zh-tw'),
  ja: () => import('dayjs/locale/ja'),
  ko: () => import('dayjs/locale/ko'),
  ar: () => import('dayjs/locale/ar'),
  hi: () => import('dayjs/locale/hi'),
};

export async function loadDayjsLocale(language: string): Promise<void> {
  const loader = locales[language.toLowerCase()];
  if (loader) {
    await loader();
    dayjs.locale(language);
  } else {
    console.warn(`Locale "${language}" not supported, falling back to "en".`);
    await locales['en']!();
    dayjs.locale('en');
  }
}

type UseLoadDayjsLocaleProps = {
  dayjsLocaleReady: boolean;
};

export const useLoadDayjsLocale = (): UseLoadDayjsLocaleProps => {
  const theme: Theme = useTheme() as Theme;
  const [dayjsLocaleReady, setDayjsLocaleReady] = useState(false);

  useEffect(() => {
    const loadLocale = async () => {
      setDayjsLocaleReady(false);
      await loadDayjsLocale(theme.formatter.locale);
      setDayjsLocaleReady(true);
    };

    loadLocale();
  }, [theme.formatter.locale]);

  return { dayjsLocaleReady };
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
