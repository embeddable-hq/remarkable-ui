import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimensionWithDateBounds,
  genericBoolean,
  genericString,
  measures,
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
import LineChartDefaultPro from './index';
import { loadData } from '@embeddable.com/core';

export const meta = {
  name: 'LineChartDefaultPro',
  label: 'Line Chart - Default',
  category: 'Line Charts',
  inputs: [
    dataset,
    {
      ...measures,
      inputs: [
        ...measures.inputs,
        { ...genericBoolean, name: 'fillUnderLine', label: 'Fill under line' },
        { ...genericString, name: 'lineColor', label: 'Line color' },
        { ...genericBoolean, name: 'connectGaps', label: 'Connect gaps', defaultValue: true },
        { ...genericBoolean, name: 'dashedLine', label: 'Dashed line', defaultValue: false },
      ],
    },
    dimensionWithDateBounds,

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

export default defineComponent(LineChartDefaultPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [...inputs.measures, inputs.dimension],
      }),
    };
  },
});
