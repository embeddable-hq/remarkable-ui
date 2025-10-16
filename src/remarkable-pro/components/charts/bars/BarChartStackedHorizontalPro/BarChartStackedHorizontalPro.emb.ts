import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import BarChartStackedHorizontalPro from './index';
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
  maxResults,
} from '../../../component.constants';

export const meta = {
  name: 'BarChartStackedHorizontalPro',
  label: 'Bar Chart - Stacked Horizontal',
  category: 'Bar Charts',
  inputs: [
    dataset,
    measure,
    { ...dimensionWithDateBounds, name: 'yAxis', label: 'Y-axis' },
    { ...dimension, name: 'groupBy', label: 'Group by' },
    title,
    description,
    maxResults,
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
      name: 'onBarClicked',
      label: 'A bar is clicked',
      properties: [
        {
          name: 'axisDimensionValue',
          label: 'Clicked Axis Dimension Value',
          type: 'string',
        },
        {
          name: 'groupingDimensionValue',
          label: 'Clicked Grouping Dimension Value',
          type: 'string',
        },
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(BarChartStackedHorizontalPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        limit: inputs.maxResults,
        from: inputs.dataset,
        select: [inputs.yAxis, inputs.groupBy, inputs.measure],
      }),
    };
  },
  events: {
    onBarClicked: (value) => {
      return {
        axisDimensionValue: value.axisDimensionValue || Value.noFilter(),
        groupingDimensionValue: value.groupingDimensionValue || Value.noFilter(),
      };
    },
  },
});
