import { loadData, DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';
import { title, description, showLegend, showToolTips, showValueLabels, maxLegendItems } from '../../../constants/commonChartInputs'

import DonutChartWithLabel from './index';

export type DonutChartWithLabelProps = {
    description?: string;
    dimension: Dimension;
    innerLabelMeasure: Measure,
    maxLegendItems?: number;
    measure: Measure;
    results: DataResponse;
    resultsInnerLabel: DataResponse;
    showLegend?: boolean;
    showTooltips?: boolean;
    showValueLabels?: boolean;
    title?: string;
}

export const meta = {
  name: 'DonutChartWithLabel',
  label: 'Donut Chart With Label',
  category: 'Pie Charts',
  inputs: [
    {
        name: 'dataset',
        type: 'dataset' as 'dataset',
        label: 'Dataset',
        required: true,
        category: 'Chart Data'
    },
    {
        name: 'measure',
        type: 'measure' as 'measure',
        label: 'Measure',
        config: {
            dataset: 'dataset', // restricts measure options to the selected dataset
        },
        required: true,
        category: 'Chart Data'
    },
    {
        name: 'dimension',
        type: 'dimension' as 'dimension',
        label: 'Dimension',
        config: {
            dataset: 'dataset',
        },
        required: true,
        category: 'Chart Data'
    },
    {
        name: 'innerLabelMeasure',
        type: 'measure',
        label: 'Inner Label Measure',
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
    {...showValueLabels},   
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(DonutChartWithLabel, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
        ...inputs,
        results: loadData({
            from: inputs.dataset,
            measures: [inputs.measure], 
            dimensions: [inputs.dimension], 
        }),
        resultsInnerLabel: loadData({
            from: inputs.dataset,
            measures: [inputs.innerLabelMeasure]
        })
    };
  },
});
