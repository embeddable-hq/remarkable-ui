import { CssSize } from '../../types/css.types';

export type KpiChartProps = {
  value: number;
  changeFontSize?: number;
  comparisonValue?: number;
  showChangeAsPercentage?: boolean;
  invertChangeColors?: boolean;
  comparisonLabel?: string;
  equalComparisonLabel?: string;
  valueFontSize?: CssSize;
  valueFormatter?: (value: number) => string;
};
