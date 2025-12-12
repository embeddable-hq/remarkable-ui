import { CssSize } from '../../../types/css.types';

export type KpiChartProps = {
  value: number;
  trendFontSize?: number;
  comparisonValue?: number;
  showChangeAsPercentage?: boolean;
  invertChangeColors?: boolean;
  comparisonLabel?: string;
  equalComparisonLabel?: string;
  percentageDecimalPlaces?: number;
  valueFontSize?: CssSize;
  noPreviousDataLabel?: string;
  valueFormatter?: (value: number) => string;
};
