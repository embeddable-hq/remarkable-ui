import { loadData, DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { title, description } from '../../constants/chartInputs'

import { PieWrapper } from './components/PieWrapper'

export const meta = {
  name: 'PieChart',
  label: 'Pie Chart',
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
    {
        name: 'title',
        type: 'string',
        label: 'Title',
        category: 'Chart Header'
    },
    {
        name: 'description',
        type: 'string',
        label: 'Description',
        category: 'Chart Header'
    },  
    {
        name: 'showLegend',
        type: 'boolean',
        label: 'Show Legend',
        defaultValue: true,
        category: 'Chart Settings'
    },
    {
        name: 'maxLegendItems',
        type: 'number',
        label: 'Max Legend Items',
        defaultValue: 10,
        category: 'Chart Settings'
    },  
    {
        name: 'showTooltips',
        type: 'boolean',
        label: 'Show Tooltips',
        defaultValue: true,
        category: 'Chart Settings'
    }, 
    {
        name: 'showValueLabels',
        type: 'boolean',
        label: 'Show Value Labels',
        defaultValue: true,
        category: 'Chart Settings'
    },   
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(PieWrapper, meta, {
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
});
