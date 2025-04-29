// Embeddable Libraries
import { Value, loadData, DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

// Local Libraries
import { title, description, showLegend, showToolTips, showValueLabels, maxLegendItems } from '../../../constants/commonChartInputs';
import DonutChart from './index';

export type DonutChartProps = {
  description?: string;
  dimension: Dimension;
  maxLegendItems?: number;
  measure: Measure;
  results: DataResponse;
  showLegend?: boolean;
  showTooltips?: boolean;
  showValueLabels?: boolean;
  title?: string;
  onSegmentClick: (args: { dimensionValue: string | null; }) => void;
}

export const meta = {
  name: 'DonutChart',
  label: 'Donut Chart',
  category: 'Pie Charts',
  inputs: [
    {
        name: 'dataset',
        type: 'dataset',
        label: 'Dataset',
        required: true,
        category: 'Chart Data'
    },
    {
        name: 'measure',
        type: 'measure',
        label: 'Measure',
        config: {
            dataset: 'dataset', // restricts measure options to the selected dataset
        },
        required: true,
        category: 'Chart Data'
    },
    {
        name: 'dimension',
        type: 'dimension',
        label: 'Dimension',
        config: {
            dataset: 'dataset',
        },
        required: true,
        category: 'Chart Data'
    },
    {...title},
    {...description},  
    {...showLegend},
    {...maxLegendItems},  
    {...showToolTips}, 
    {...showValueLabels}
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
        }
      ],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(DonutChart, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
        ...inputs,
        results: loadData({
            from: inputs.dataset,
            measures: [inputs.measure], 
            dimensions: [inputs.dimension], 
        })
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
