import { CssSize } from '../../../types/css.types';

export type KpiChartProps = {
  value: number;
  trendFontSize?: number;
  comparisonValue?: number;
  showChangeAsPercentage?: boolean;
  invertChangeColors?: boolean;
  /** Reverses the trend arrow independently of `invertChangeColors`. Defaults to `invertChangeColors`. */
  invertTrendDirection?: boolean;
  comparisonLabel?: string;
  equalComparisonLabel?: string;
  percentageDecimalPlaces?: number;
  valueFontSize?: CssSize;
  noPreviousDataLabel?: string;
  displayNullAs?: string;
  valueFormatter?: (value: number) => string;
};
