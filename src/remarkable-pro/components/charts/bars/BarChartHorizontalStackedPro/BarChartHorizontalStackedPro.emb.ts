import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import BarChartHorizontalStackedPro from './index';
import {
  dataset,
  description,
  dimensionWithDateBounds,
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
  name: 'BarChartHorizontalStackedPro',
  label: 'Bar Chart Horizontal Stacked',
  category: 'Bar Charts',
  inputs: [
    dataset,
    measure,
    { ...dimensionWithDateBounds, name: 'yAxis', label: 'Y-axis' },
    { ...dimensionWithDateBounds, name: 'groupBy', label: 'Group by' },
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

export default defineComponent(BarChartHorizontalStackedPro, meta, {
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
