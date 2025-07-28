import type { Preview } from '@storybook/react';
import { injectCssVariables } from '../src/theme/theme.utils';
import { remarkableTheme } from '../src/theme/theme';
import './i18n';
import i18next from 'i18next';

export const globalTypes = {
  locale: {
    name: 'Locale',
    description: 'Internationalization locale',
    defaultValue: 'en',
    toolbar: {
      icon: 'globe',
      items: [
        { value: 'en', title: 'English' },
        { value: 'de', title: 'German' },
      ],
    },
  },
};

export const decorators = [
  (Story, context) => {
    const { locale } = context.globals;

    if (i18next.language !== locale) {
      i18next.changeLanguage(locale);
    }

    return Story();
  },
];

injectCssVariables(remarkableTheme);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
