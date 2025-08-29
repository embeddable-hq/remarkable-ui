import { en } from './i18n/translations/en';
import { de } from './i18n/translations/de';
import { remarkableThemeFormatter } from './formatter/formatter.constants';
import { remarkableThemeStyles } from './styles/styles.constants';
import { Theme, ThemeCharts } from './theme.types';
import { defaultDateTimeSelectFieldProOptions } from '../components/editors/DateRangeSelectFieldPro/DateRangeSelectFieldPro.constants';
import { defaultChartMenuProOptions } from '../components/charts/shared/ChartCard/ChartCardMenuPro/ChartCardMenuPro.constants';

const remarkableThemeI18n = {
  language: 'en',
  translations: {
    en,
    de,
  },
};

const remarkableThemeCharts: ThemeCharts = {
  legendPosition: 'bottom',
  chartCardMenuPro: {
    options: defaultChartMenuProOptions,
  },
};

const remarkableThemeEditors = {
  dateRangeSelectFieldProOptions: {
    options: defaultDateTimeSelectFieldProOptions,
  },
};

export const remarkableTheme: Theme = {
  i18n: remarkableThemeI18n,
  charts: remarkableThemeCharts,
  editors: remarkableThemeEditors,
  formatter: remarkableThemeFormatter,
  styles: remarkableThemeStyles,
} as const;
