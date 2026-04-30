import { ChartData } from 'chart.js';
import { ScatterChartConfigurationProps, ScatterChartInputPoint } from './scatter.types';
import type { ScatterNullBandResult } from './scatter.nullBand.utils';
import { filterNumericScatterData, getScatterDataWithNullBand } from './scatter.utils';

export const getScatterChartData = (
  data: ChartData<'scatter', ScatterChartInputPoint[]>,
  props: ScatterChartConfigurationProps & { nullBand: ScatterNullBandResult | null },
): ChartData<'scatter'> => {
  const dataForChart = props.showLogarithmicScale ? filterNumericScatterData(data) : data;
  return getScatterDataWithNullBand(dataForChart, {
    nullBand: props.nullBand,
    supportsNullMeasures: !props.showLogarithmicScale,
  });
};
