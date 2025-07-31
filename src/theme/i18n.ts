import i18n from 'i18next';
import { Theme } from './theme';

const i18nSetup = (theme: Theme) => {
  if (i18n.language === theme.i18n.language && i18n.isInitialized) return;

  i18n.init({
    lng: theme.i18n.language,
    fallbackLng: 'en',
    resources: theme.i18n.translations,
    interpolation: {
      escapeValue: false,
    },
  });
};

export { i18nSetup, i18n };
