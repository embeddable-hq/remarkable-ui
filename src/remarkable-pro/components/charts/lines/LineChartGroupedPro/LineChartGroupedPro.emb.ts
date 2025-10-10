import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimension,
  dimensionWithDateBounds,
  genericBoolean,
  genericNumber,
  measure,
  reverseXAxis,
  showLegend,
  showLogarithmicScale,
  showTooltips,
  showValueLabels,
  title,
  xAxisLabel,
  yAxisLabel,
  yAxisRangeMax,
  yAxisRangeMin,
} from '../../../component.constants';
import LineChartGroupedPro from './index';
import { loadData } from '@embeddable.com/core';

export const meta = {
  name: 'LineChartGroupedPro',
  label: 'Line Chart - Grouped',
  category: 'Line Charts',
  inputs: [
    dataset,
    {
      ...measure,
      inputs: [
        ...measure.inputs,
        { ...genericBoolean, name: 'fillUnderLine', label: 'Fill under line' },
        { ...genericBoolean, name: 'connectGaps', label: 'Connect gaps', defaultValue: true },
        { ...genericBoolean, name: 'dashedLine', label: 'Dashed line', defaultValue: false },
      ],
    },
    { ...dimensionWithDateBounds, name: 'xAxis', label: 'X-axis' },
    { ...dimension, name: 'groupBy', label: 'Group by' },
    {
      ...genericNumber,
      name: 'maxLegendItems',
      label: 'Max legend items',
      category: 'Component Data',
      defaultValue: 8,
    },
    title,
    description,
    showLegend,
    showTooltips,
    showValueLabels,
    showLogarithmicScale,
    xAxisLabel,
    yAxisLabel,
    reverseXAxis,
    yAxisRangeMin,
    yAxisRangeMax,
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(LineChartGroupedPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [inputs.xAxis, inputs.groupBy, inputs.measure],
      }),
    };
  },
});
