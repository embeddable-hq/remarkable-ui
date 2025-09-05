import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import BarChartPro from './index';
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
  reverseXAxis,
  yAxisRangeMin,
  yAxisRangeMax,
  xAxisMaxItems,
} from '../../../component.constants';

export const meta = {
  name: 'BarChartPro',
  label: 'Bar Chart',
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
    reverseXAxis,
    yAxisRangeMin,
    yAxisRangeMax,
    xAxisMaxItems,
  ],
  events: [
    {
      name: 'onSegmentClick',
      label: 'A segment is clicked',
      properties: [
        {
          name: 'dimensionValue',
          label: 'Clicked Dimension',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(BarChartPro, meta, {
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
