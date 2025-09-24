import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import BarChartHorizontalGroupedPro from './index';
import {
  dataset,
  description,
  dimensionWithDateBounds,
  dimension,
  showLegend,
  showTooltips,
  showValueLabels,
  title,
  measure,
  showLogarithmicScale,
  xAxisLabel,
  yAxisLabel,
  showTotalLabels,
  reverseYAxis,
  xAxisRangeMin,
  xAxisRangeMax,
} from '../../../component.constants';

export const meta = {
  name: 'BarChartHorizontalGroupedPro',
  label: 'Bar Chart Horizontal Grouped',
  category: 'Bar Charts',
  inputs: [
    dataset,
    measure,
    { ...dimensionWithDateBounds, name: 'yAxis', label: 'Y-axis' },
    { ...dimension, name: 'groupBy', label: 'Group by' },
    title,
    description,
    showLegend,
    showTooltips,
    { ...showValueLabels, defaultValue: false },
    showLogarithmicScale,
    xAxisLabel,
    yAxisLabel,
    reverseYAxis,
    xAxisRangeMin,
    xAxisRangeMax,
    showTotalLabels,
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

export default defineComponent(BarChartHorizontalGroupedPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [inputs.yAxis, inputs.groupBy, inputs.measure],
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
