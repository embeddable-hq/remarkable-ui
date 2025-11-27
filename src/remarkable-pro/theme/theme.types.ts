import { Resource } from 'i18next';
import { ThemeFormatter } from './formatter/formatter.types';
import { ThemeStyles } from './styles/styles.types';
import { ChartOptions } from 'chart.js';
import { ComparisonPeriodOption } from './defaults/defaults.ComparisonPeriods.constants';
import { DateRangeOption } from './defaults/defaults.DateRanges.constants';
import { ChartCardMenuOption } from './defaults/defaults.ChartCardMenu.constants';

export type ThemeI18n = { language: string; translations: Resource };

export type ThemeChartsLegendPosition = 'top' | 'right' | 'bottom' | 'left';

export type ThemeCharts = {
  backgroundColors?: string[];
  borderColors?: string[];
  legendPosition: ThemeChartsLegendPosition;

  // Charts overrides
  pieChartPro?: { options: Partial<ChartOptions<'pie'>> };
  donutChartPro?: { options: Partial<ChartOptions<'pie'>> };
  donutLabelChartPro?: { options: Partial<ChartOptions<'pie'>> };
  barChartDefaultPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartDefaultHorizontalPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartGroupedPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartGroupedHorizontalPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartStackedPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartStackedHorizontalPro?: { options: Partial<ChartOptions<'bar'>> };
  lineChartDefaultPro?: { options: Partial<ChartOptions<'line'>> };
  lineChartGroupedPro?: { options: Partial<ChartOptions<'line'>> };
  lineChartComparisonDefaultPro?: { options: Partial<ChartOptions<'line'>> };
};

export type ThemeDefaults = {
  comparisonPeriodsOptions: ComparisonPeriodOption[];
  dateRangesOptions: DateRangeOption[];
  chartMenuOptions: ChartCardMenuOption[];
};

export type Theme = {
  i18n: ThemeI18n;
  charts: ThemeCharts;
  styles: ThemeStyles;
  formatter: ThemeFormatter;
  defaults: ThemeDefaults;
};
