import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimensionWithDateBounds,
  genericBoolean,
  genericString,
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
import KpiChartNumberPro from './index';
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
        { ...genericString, name: 'lineColor', label: 'Line color' },
        { ...genericBoolean, name: 'connectGaps', label: 'Connect gaps', defaultValue: false },
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

export default defineComponent(KpiChartNumberPro, meta, {
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
