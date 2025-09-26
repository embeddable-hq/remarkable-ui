export type KpiChartProps = {
  value: number;
  comparisonValue?: number;
  showChangeAsPercentage?: boolean;
  invertChangeColors?: boolean;
  comparisonLabel?: string;
  equalComparisonLabel?: string;
};
