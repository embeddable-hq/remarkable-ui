import { Resource } from 'i18next';
import { ThemeFormatter } from './formatter/formatter.types';
import { ThemeStyles } from './styles/styles.types';
import { ChartOptions } from 'chart.js';
import { ChartCardMenuProOption } from '../components/charts/shared/ChartCard/ChartCardMenuPro/ChartCardMenuPro.types';
import { DateRangeSelectFieldProOption } from '../components/editors/DateRangeSelectFieldPro/DateRangeSelectFieldPro.types';
import { ComparisonPeriodSelectFieldProOption } from '../components/editors/ComparisonPeriodSelectFieldPro/ComparisonPeriodSelectFieldPro.types';

export type ThemeI18n = { language: string; translations: Resource };

export type ThemeChartsLegendPosition = 'top' | 'right' | 'bottom' | 'left';

export type ThemeCharts = {
  backgroundColors?: string[];
  borderColors?: string[];
  legendPosition: ThemeChartsLegendPosition;
  chartCardMenuPro: { options: ChartCardMenuProOption[] };

  // Charts overrides
  pieChartPro?: { options: Partial<ChartOptions<'pie'>> };
  donutChartPro?: { options: Partial<ChartOptions<'pie'>> };
  donutLabelChartPro?: { options: Partial<ChartOptions<'pie'>> };
  barChartPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartDefaultPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartDefaultHorizontalPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartGroupedPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartGroupedHorizontalPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartStackedPro?: { options: Partial<ChartOptions<'bar'>> };
  barChartStackedHorizontalPro?: { options: Partial<ChartOptions<'bar'>> };
};

export type ThemeEditors = {
  dateRangeSelectFieldPro: {
    options: DateRangeSelectFieldProOption[];
  };
  comparisonPeriodSelectFieldPro: {
    options: ComparisonPeriodSelectFieldProOption[];
  };
};

export type Theme = {
  i18n: ThemeI18n;
  charts: ThemeCharts;
  styles: ThemeStyles;
  formatter: ThemeFormatter;
  editors: ThemeEditors;
};
