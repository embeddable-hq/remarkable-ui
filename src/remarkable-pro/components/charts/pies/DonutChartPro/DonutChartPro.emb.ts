import { Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import DonutChartPro from './index';
import {
  dimension,
  dataset,
  description,
  measure,
  maxLegendItems,
  showLegend,
  showTooltips,
  showValueLabels,
  title,
} from '../../../component.constants';

export const meta = {
  name: 'DonutChartPro',
  label: 'Donut Chart',
  category: 'Pie Charts',
  inputs: [
    dataset,
    measure,
    dimension,
    title,
    description,
    showLegend,
    maxLegendItems,
    showTooltips,
    showValueLabels,
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

export default defineComponent(DonutChartPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [inputs.measure, inputs.dimension],
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
