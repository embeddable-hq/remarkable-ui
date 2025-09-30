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
    options: [
      { value: 'Today', label: 'Today', dateFormat: 'MMM DD' },
      { value: 'Yesterday', label: 'Yesterday', dateFormat: 'MMM DD' },
      { value: 'This week', label: 'This week', dateFormat: 'MMM DD' },
      { value: 'Last week', label: 'Last week', dateFormat: 'MMM DD' },
      { value: 'Week to date', label: 'Week to date', dateFormat: 'MMM DD' },
      { value: 'Last 7 days', label: 'Last 7 days', dateFormat: 'MMM DD' },
      { value: 'Next 7 days', label: 'Next 7 days', dateFormat: 'MMM DD' },
      { value: 'Last 30 days', label: 'Last 30 days', dateFormat: 'MMM DD' },
      { value: 'Next 30 days', label: 'Next 30 days', dateFormat: 'MMM DD' },
      { value: 'This month', label: 'This month', dateFormat: 'MMM YYYY' },
      { value: 'Last month', label: 'Last month', dateFormat: 'MMM YYYY' },
      { value: 'Next month', label: 'Next month', dateFormat: 'MMM YYYY' },
      { value: 'This quarter', label: 'This quarter', dateFormat: 'MMM YYYY' },
      { value: 'Last quarter', label: 'Last quarter', dateFormat: 'MMM YYYY' },
      { value: 'Next quarter', label: 'Next quarter', dateFormat: 'MMM YYYY' },
      { value: 'Quarter to date', label: 'Quarter to date', dateFormat: 'MMM YYYY' },
      { value: 'Last 6 months', label: 'Last 6 months', dateFormat: 'MMM YYYY' },
      { value: 'Last 12 months', label: 'Last 12 months', dateFormat: 'MMM YYYY' },
      { value: 'This year', label: 'This year', dateFormat: 'YYYY' },
      { value: 'Last year', label: 'Last year', dateFormat: 'YYYY' },
      { value: 'Next year', label: 'Next year', dateFormat: 'YYYY' },
      { value: 'Year to date', label: 'Year to date', dateFormat: 'MMM YYYY' },
    ],
  },
  comparisonPeriodSelectFieldPro: {
    options: [
      {
        value: 'Previous period',
        label: 'defaults.comparisonPeriodOptions.previousPeriod|Previous period',
        dateFormat: 'DD MMM YYYY',
      },
      {
        value: 'Previous week',
        label: 'defaults.comparisonPeriodOptions.previousWeek|Previous week',
        dateFormat: 'MMM DD',
      },
      {
        value: 'Previous month',
        label: 'defaults.comparisonPeriodOptions.previousMonth|Previous month',
        dateFormat: 'MMM YYYY',
      },
      {
        value: 'Previous quarter',
        label: 'defaults.comparisonPeriodOptions.previousQuarter|Previous quarter',
        dateFormat: 'MMM YYYY',
      },
      {
        value: 'Previous year',
        label: 'defaults.comparisonPeriodOptions.previousYear|Previous year',
        dateFormat: 'YYYY',
      },
    ],
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
