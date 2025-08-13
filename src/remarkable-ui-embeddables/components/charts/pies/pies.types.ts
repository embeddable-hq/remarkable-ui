import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

export interface DefaultReadyMadePieChartProps {
  description: string;
  dimension: Dimension;
  maxLegendItems: number;
  measure: Measure;
  results: DataResponse;
  showLegend: boolean;
  showTooltips: boolean;
  showValueLabels: boolean;
  title: string;
  onSegmentClick: (args: { dimensionValue: string | null }) => void;
}
