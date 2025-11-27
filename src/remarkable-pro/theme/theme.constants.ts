import { en } from './i18n/translations/en';
import { de } from './i18n/translations/de';
import { remarkableThemeFormatter } from './formatter/formatter.constants';
import { remarkableThemeStyles } from './styles/styles.constants';
import { Theme, ThemeCharts, ThemeDefaults } from './theme.types';
import { defaultComparisonPeriodOptions } from './defaults/defaults.ComparisonPeriods.constants';
import { defaultDateRangeOptions } from './defaults/defaults.DateRanges.constants';
import { defaultChartMenuProOptions } from './defaults/defaults.ChartCardMenu.constants';

const remarkableThemeI18n = {
  language: 'en',
  translations: {
    en,
    de,
  },
};

const remarkableThemeCharts: ThemeCharts = {
  legendPosition: 'bottom',
};

const remarkableThemeDefaults: ThemeDefaults = {
  comparisonPeriodsOptions: defaultComparisonPeriodOptions,
  dateRangesOptions: defaultDateRangeOptions,
  chartMenuOptions: defaultChartMenuProOptions,
};

export const remarkableTheme: Theme = {
  i18n: remarkableThemeI18n,
  charts: remarkableThemeCharts,
  formatter: remarkableThemeFormatter,
  styles: remarkableThemeStyles,
  defaults: remarkableThemeDefaults,
} as const;
