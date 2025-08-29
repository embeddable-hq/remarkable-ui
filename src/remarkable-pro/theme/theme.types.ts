import { Resource } from 'i18next';
import { ThemeFormatter } from './formatter/formatter.types';
import { ThemeStyles } from './styles/styles.types';
import { ChartOptions } from 'chart.js';
import { ChartCardMenuProOption } from '../components/charts/shared/ChartCard/ChartCardMenuPro/ChartCardMenuPro.types';
import { DateTimeSelectFieldProOption } from '../components/editors/DateTimeSelectFieldPro/DateTimeSelectFieldPro.types';

export type ThemeI18n = { language: string; translations: Resource };

export type ThemeChartsLegendPosition = 'top' | 'right' | 'bottom' | 'left';

export type ThemeCharts = {
  pieChartOverrides?: Partial<ChartOptions<'pie'>>;
  donutChartOverrides?: Partial<ChartOptions<'pie'>>;
  donutLabelChartOverrides?: Partial<ChartOptions<'pie'>>;
  legendPosition: ThemeChartsLegendPosition;
  backgroundColors?: string[];
  borderColors?: string[];
  chartCardMenuPro: { options: ChartCardMenuProOption[] };
};

type ThemeEditors = {
  dateTimeSelectFieldPro: {
    options: DateTimeSelectFieldProOption[];
  };
};

export type Theme = {
  i18n: ThemeI18n;
  charts: ThemeCharts;
  styles: ThemeStyles;
  formatter: ThemeFormatter;
  editors: ThemeEditors;
};
