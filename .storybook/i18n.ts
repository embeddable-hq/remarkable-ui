// .storybook/i18n.ts
import i18n from 'i18next';
import { en } from '../src/theme/theme-formatter/theme-formatter-translations/en';
import { de } from '../src/theme/theme-formatter/theme-formatter-translations/de';

i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  resources: {
    en: { translation: en.translation },
    de: { translation: de.translation },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
