import { Theme } from './src/remarkable-pro/theme/theme.types';
import { Theme } from '@embeddable.com/remarkable-ui';
import { remarkableTheme } from './src/remarkable-pro/theme/theme.constants';

const blueColors = [
  '#d2ecfd',
  '#a3d4fa',
  '#6bb7f5',
  '#3a99e5',
  '#2878c6',
  '#205493',
  '#17375e',
  '#0d1a26',
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
        language: 'de',
      },
    };
  }
  return remarkableTheme;
};

export default themeProvider;
