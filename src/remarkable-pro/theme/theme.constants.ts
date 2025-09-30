import { en } from './i18n/translations/en';
import { de } from './i18n/translations/de';
import { remarkableThemeFormatter } from './formatter/formatter.constants';
import { remarkableThemeStyles } from './styles/styles.constants';
import { Theme, ThemeCharts, ThemeDefaults, ThemeEditors } from './theme.types';
import { defaultChartMenuProOptions } from '../components/charts/shared/ChartCard/ChartCardMenuPro/ChartCardMenuPro.constants';
import { defaultComparisonPeriodOptions } from './defaults/defaults.ComparisonPeriods.constants';
import { defaultDateRangeOptions } from './defaults/defaults.DateRanges.constants';

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

const remarkableThemeDefaults: ThemeDefaults = {
  comparisonPeriodsOptions: defaultComparisonPeriodOptions,
  dateRangesOptions: defaultDateRangeOptions,
};

const remarkableThemeEditors: ThemeEditors = {
  dateRangeSelectFieldPro: {
    options: remarkableThemeDefaults.dateRangesOptions.map((option) => option.value),
  },
  comparisonPeriodSelectFieldPro: {
    options: remarkableThemeDefaults.comparisonPeriodsOptions.map((option) => option.value),
  },
};

export const remarkableTheme: Theme = {
  i18n: remarkableThemeI18n,
  charts: remarkableThemeCharts,
  editors: remarkableThemeEditors,
  formatter: remarkableThemeFormatter,
  styles: remarkableThemeStyles,
  defaults: remarkableThemeDefaults,
} as const;
