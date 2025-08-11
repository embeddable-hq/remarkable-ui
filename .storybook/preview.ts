import type { Preview } from '@storybook/react';
import { injectCssVariables } from '../src/remarkable-ui-embeddables/theme/styles/stytles.utils';
import { remarkableTheme } from '../src/remarkable-ui-embeddables/theme/theme.constants';

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

// TODO: Make storybook work with i18n - on language change
// i18nSetup(remarkableTheme);
// export const decorators = [
//   (Story, context) => {
//     const { locale } = context.globals;

//     if (i18n.language !== locale) {
//       i18n.changeLanguage(locale);
//     }

//     return Story();
//   },
// ];

injectCssVariables(remarkableTheme.styles);

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
