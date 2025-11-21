import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimensionWithDateBounds,
  genericBoolean,
  maxResults,
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
import { loadData, Value } from '@embeddable.com/core';
import { LineChartProOptionsClickArg } from '../lines.utils';
import ColorType from '../../../../editors/ColorEditor/Color.type.emb';

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
        {
          type: ColorType,
          category: 'Component Settings',
          name: 'lineColor',
          label: 'Line color',
        },
        { ...genericBoolean, name: 'connectGaps', label: 'Connect gaps', defaultValue: true },
        { ...genericBoolean, name: 'dashedLine', label: 'Dashed line', defaultValue: false },
      ],
    },
    { ...dimensionWithDateBounds, label: 'X-axis', name: 'xAxis' },
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
    maxResults,
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
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(LineChartDefaultPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        limit: inputs.maxResults,
        from: inputs.dataset,
        select: [...inputs.measures, inputs.xAxis],
      }),
    };
  },
  events: {
    onLineClicked: (value: LineChartProOptionsClickArg) => {
      return {
        axisDimensionValue: value.dimensionValue || Value.noFilter(),
      };
    },
  },
});
