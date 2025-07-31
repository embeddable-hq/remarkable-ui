// Embeddable Libraries
import { DataResponse, Dimension, Measure, Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';

import PieChart from './index';
import {
  dimension,
  dataset,
  description,
  measure,
  maxLegendItems,
  showLegend,
  showToolTips,
  showValueLabels,
  title,
} from '../../ready-made.constants';

export type PieChartProps = {
  description?: string;
  dimension: Dimension;
  maxLegendItems?: number;
  measure: Measure;
  onSegmentClick: (args: { dimensionValue: string | null }) => void;
  results: DataResponse;
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  title?: string;
};
// & ExportOptionFlags;

export const meta = {
  name: 'PieChart',
  label: 'Pie Chart',
  category: 'Pie Charts',
  inputs: [
    { ...dataset },
    { ...measure },
    { ...dimension },
    { ...title },
    { ...description },
    { ...showLegend },
    { ...maxLegendItems },
    { ...showToolTips },
    { ...showValueLabels },
    // ...exportOptions,
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

export default defineComponent(PieChart, meta, {
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
