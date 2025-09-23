import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import BarChartHorizontalPro from './index';
import {
  dataset,
  description,
  dimension,
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
  name: 'BarChartHorizontalPro',
  label: 'Bar Chart Horizontal',
  category: 'Bar Charts',
  inputs: [
    dataset,
    measures,
    dimension,
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
      name: 'onSegmentClick',
      label: 'A bar is clicked',
      properties: [
        {
          name: 'dimensionValue',
          label: 'Clicked Dimension value',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(BarChartHorizontalPro, meta, {
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
    onSegmentClick: (value) => {
      return {
        dimensionValue: value.dimensionValue || Value.noFilter(),
      };
    },
  },
});
