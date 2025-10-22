import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimension,
  dimensionWithDateBounds,
  genericBoolean,
  maxResults,
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
import { loadData, Value } from '@embeddable.com/core';
import { LineChartProOptionsClickArg } from '../lines.utils';

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
      ],
    },
    { ...dimensionWithDateBounds, name: 'xAxis', label: 'X-axis' },
    { ...dimension, name: 'groupBy', label: 'Group by' },
    title,
    description,
    maxResults,
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
  events: [
    {
      name: 'onLineClicked',
      label: 'A line is clicked',
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

export default defineComponent(LineChartGroupedPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        limit: inputs.maxResults,
        from: inputs.dataset,
        select: [inputs.xAxis, inputs.groupBy, inputs.measure],
      }),
    };
  },
  events: {
    onLineClicked: (value: LineChartProOptionsClickArg) => {
      return {
        axisDimensionValue: value.dimensionValue || Value.noFilter(),
        groupingDimensionValue: value.groupingDimensionValue || Value.noFilter(),
      };
    },
  },
});
