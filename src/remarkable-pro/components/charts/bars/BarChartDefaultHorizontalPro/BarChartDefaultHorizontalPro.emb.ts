import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import BarChartDefaultHorizontalPro from './index';
import {
  dataset,
  description,
  dimensionWithDateBounds,
  showLegend,
  showTooltips,
  showValueLabels,
  title,
  measures,
  showLogarithmicScale,
  xAxisLabel,
  yAxisLabel,
  reverseYAxis,
  xAxisRangeMin,
  xAxisRangeMax,
  yAxisMaxItems,
} from '../../../component.constants';

export const meta = {
  name: 'BarChartDefaultHorizontalPro',
  label: 'Bar Chart - Default Horizontal',
  category: 'Bar Charts',
  inputs: [
    dataset,
    measures,
    { ...dimensionWithDateBounds, label: 'Y-axis' },
    title,
    description,
    showLegend,
    showTooltips,
    showValueLabels,
    showLogarithmicScale,
    xAxisLabel,
    yAxisLabel,
    reverseYAxis,
    xAxisRangeMin,
    xAxisRangeMax,
    yAxisMaxItems,
  ],
  events: [
    {
      name: 'onBarClicked',
      label: 'A bar is clicked',
      properties: [
        {
          name: 'axisDimensionValue',
          label: 'Clicked Axis Dimension Value',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(BarChartDefaultHorizontalPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [...inputs.measures, inputs.dimension],
      }),
    };
  },
  events: {
    onBarClicked: (value) => {
      return {
        axisDimensionValue: value.axisDimensionValue || Value.noFilter(),
      };
    },
  },
});
