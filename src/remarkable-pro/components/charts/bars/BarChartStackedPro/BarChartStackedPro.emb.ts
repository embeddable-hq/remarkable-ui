import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import BarChartStackedPro from './index';
import {
  dataset,
  description,
  timeDimension,
  dimension,
  showLegend,
  showTooltips,
  showValueLabels,
  title,
  measure,
  showLogarithmicScale,
  xAxisLabel,
  yAxisLabel,
  reverseXAxis,
  yAxisRangeMin,
  yAxisRangeMax,
  showTotalLabels,
} from '../../../component.constants';

export const meta = {
  name: 'BarChartStackedPro',
  label: 'Bar Chart Stacked',
  category: 'Bar Charts',
  inputs: [
    dataset,
    measure,
    { ...timeDimension, name: 'xAxis', label: 'X-axis' },
    { ...dimension, name: 'groupBy', label: 'Group by' },
    title,
    description,
    showLegend,
    showTooltips,
    { ...showValueLabels, defaultValue: false },
    showLogarithmicScale,
    xAxisLabel,
    yAxisLabel,
    reverseXAxis,
    yAxisRangeMin,
    yAxisRangeMax,
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

export default defineComponent(BarChartStackedPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [inputs.xAxis, inputs.groupBy, inputs.measure],
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
