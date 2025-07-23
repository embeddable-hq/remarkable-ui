import { themeFormatter } from './theme-formatter/theme-formatter';
import { ThemeFormatter } from './theme-formatter/theme-formatter.types';
import {
  themeChartBorderColors,
  themeChartColors,
  ThemeStyles,
  themeStyles,
} from './theme.constants';

export type Theme = {
  charts: {
    colors: string[];
    borderColors?: string[];
    legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  };
  // TODO: add as we go
  styles: ThemeStyles;
  formatter: ThemeFormatter;
};

export const theme: Theme = {
  charts: {
    borderColors: themeChartBorderColors,
    colors: themeChartColors,
  },
  formatter: themeFormatter,
  styles: themeStyles,
};
