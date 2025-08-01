import { defaultThemeFormatter } from './theme-formatter/theme-formatter.contants';
import { ThemeFormatter } from './theme-formatter/theme-formatter.types';
import {
  defaultChartsMenuOptions,
  defaultThemeStyles,
  ThemeChartsMenuOption,
  ThemeStyles,
} from './theme.constants';

import { en } from './theme-formatter/theme-formatter-translations/en';
import { de } from './theme-formatter/theme-formatter-translations/de';
import { Resource } from 'i18next';

export type ThemeChartsLegendPosition = 'top' | 'right' | 'bottom' | 'left';

export type Theme = {
  i18n: { language: string; translations: Resource };
  charts: {
    menuOptions: ThemeChartsMenuOption[];
    legendPosition: ThemeChartsLegendPosition;
  };
  styles: ThemeStyles;
  formatter: ThemeFormatter;
};

export const remarkableTheme: Theme = {
  i18n: {
    language: 'en',
    translations: {
      en,
      de,
    },
  },
  charts: {
    menuOptions: defaultChartsMenuOptions,
    legendPosition: 'bottom',
  },
  formatter: defaultThemeFormatter,
  styles: defaultThemeStyles,
} as const;
