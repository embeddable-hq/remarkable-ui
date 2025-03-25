import { loadData, DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import {  } from '@embeddable.com/core';

import Component from './index';

export type PieChartProps = {
    measure: Measure;
    dimension: Dimension;
    results: DataResponse;
    title: string;
    description: string;
};

export const meta = {
  name: 'PieChart',
  label: 'Pie Chart',
  category: 'Pie Charts',
  inputs: [
    {
        name: 'title',
        type: 'string',
        label: 'Title',
    },
    {
        name: 'description',
        type: 'string',
        label: 'Description',
    },
    {
        name: 'dataset',
        type: 'dataset',
        label: 'Dataset',
    },
    {
        name: 'measure',
        type: 'measure',
        label: 'Measure',
        config: {
            dataset: 'dataset', // restricts measure options to the selected dataset
        }
    },
    {
        name: 'dimension',
        type: 'dimension',
        label: 'Dimension',
        config: {
            dataset: 'dataset',
        }
    },   
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
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
