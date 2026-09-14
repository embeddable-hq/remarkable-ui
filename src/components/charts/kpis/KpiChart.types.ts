import { CssSize } from '../../../types/css.types';

export type KpiChartProps = {
  value: number;
  trendFontSize?: number;
  comparisonValue?: number;
  showChangeAsPercentage?: boolean;
  invertChangeColors?: boolean;
  /**
   * Reverses the trend arrow direction independently of `invertChangeColors`.
   * Defaults to `invertChangeColors` when not provided, preserving the
   * previous behavior where a single toggle controlled both color and arrow
   * direction (see TPS-1470).
   */
  reverseTrendDirection?: boolean;
  comparisonLabel?: string;
  equalComparisonLabel?: string;
  percentageDecimalPlaces?: number;
  valueFontSize?: CssSize;
  noPreviousDataLabel?: string;
  displayNullAs?: string;
  valueFormatter?: (value: number) => string;
};
