import i18next, { i18n } from 'i18next';
import { remarkableTheme, Theme } from './theme';
import { useTheme } from '@embeddable.com/react';

export const i18nTheme = (): i18n => {
  if (i18next.isInitialized) return i18next;

  let theme = remarkableTheme;

  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    theme = useTheme() as Theme;
  } catch {
    console.warn('Failed to get theme from useTheme, using default remarkableTheme');
  }

  i18next.init({
    lng: navigator.language,
    fallbackLng: 'en',
    resources: theme.formatter.translations,
    interpolation: {
      escapeValue: false,
    },
  });

  return i18next;
};
