import { Resource } from 'i18next';
import { ThemeFormatter } from './formatter/formatter.types';
import { ThemeStyles } from './styles/styles.types';
import { ChartOptions } from 'chart.js';
import { ChartCardMenuProOption } from '../components/charts/shared/ChartCard/ChartCardMenuPro/ChartCardMenuPro.types';
import { DateTimeSelectFieldProOption } from '../components/editors/DateRangeSelectFieldPro/DateRangeSelectFieldPro.types';

export type ThemeI18n = { language: string; translations: Resource };

export type ThemeChartsLegendPosition = 'top' | 'right' | 'bottom' | 'left';

export type ThemeCharts = {
  pieChartPro?: { options: Partial<ChartOptions<'pie'>> };
  donutChartPro?: { options: Partial<ChartOptions<'pie'>> };
  donutLabelChartPro?: { options: Partial<ChartOptions<'pie'>> };
  barChartPro?: { options: Partial<ChartOptions<'bar'>> };
  backgroundColors?: string[];
  borderColors?: string[];
  legendPosition: ThemeChartsLegendPosition;
  chartCardMenuPro: { options: ChartCardMenuProOption[] };
};

export type ThemeEditors = {
  dateRangeSelectFieldPro: {
    options: DateTimeSelectFieldProOption[];
  };
};

export type Theme = {
  id: string;
  i18n: ThemeI18n;
  charts: ThemeCharts;
  styles: ThemeStyles;
  formatter: ThemeFormatter;
  editors: ThemeEditors;
};
