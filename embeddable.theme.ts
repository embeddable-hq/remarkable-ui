import { Theme } from './src/remarkable-pro/theme/theme.types';
import { Theme } from '@embeddable.com/remarkable-ui';
import { remarkableTheme } from './src/remarkable-pro/theme/theme.constants';

const blueColors = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
];

// const germanTheme: DeepPartial<Theme> = {
//   i18n: {
//     language: "de",
//     translations: {
//       de: {
//         translation: {
//           welcomeToEmbeddable: "Willkommen bei Embeddable",
//         },
//       },
//     },
//   },
//   formatter: {
//     locale: "de",
//   },
//   charts: {
//     backgroundColors: blueColors,
//     borderColors: blueColors,
//   },
// };

const themeProvider = (clientContext: object): Theme => {
  if (clientContext.theme == 'german') {
    return {
      ...remarkableTheme,
      charts: {
        ...remarkableTheme.charts,
        backgroundColors: blueColors,
        borderColors: blueColors,
      },
      i18n: {
        ...remarkableTheme.i18n,
        // language: 'de',
      },
    };
  }
  return remarkableTheme;
};

export default themeProvider;
