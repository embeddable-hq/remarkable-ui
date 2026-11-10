import { CssSize } from '../../../types/css.types';

export type KpiChartProps = {
  value: number | null;
  trendFontSize?: number;
  comparisonValue?: number | null;
  showChangeAsPercentage?: boolean;
  invertChangeColors?: boolean;
  /** Reverses only the trend arrow. Defaults to `invertChangeColors`. */
  invertTrendDirection?: boolean;
  comparisonLabel?: string;
  equalComparisonLabel?: string;
  percentageDecimalPlaces?: number;
  valueFontSize?: CssSize;
  noPreviousDataLabel?: string;
  displayNullAs?: string;
  valueFormatter?: (value: number) => string;
  /**
   * Formats the change when `showChangeAsPercentage` is on. Receives the
   * percentage (7.4 for +7.4%) and returns the full label, so a locale can
   * place its own decimal separator and percent sign (`7,4 %` in German).
   * Defaults to `toFixed(percentageDecimalPlaces)` followed by `%`.
   */
  percentageFormatter?: (percentage: number) => string;
};
