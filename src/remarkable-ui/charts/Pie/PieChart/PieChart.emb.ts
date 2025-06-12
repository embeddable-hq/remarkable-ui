// Embeddable Libraries
import { DataResponse, Dimension, Measure, Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';

// Local Libraries
import {
	description,
	maxLegendItems,
	showLegend,
	showToolTips,
	showValueLabels,
	title,
} from '../../../constants/commonChartInputs';
import PieChart from './index';

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
			category: 'Chart Data',
		},
		{
			name: 'measure',
			type: 'measure',
			label: 'Measure',
			config: {
				dataset: 'dataset', // restricts measure options to the selected dataset
			},
			required: true,
			category: 'Chart Data',
		},
		{
			name: 'dimension',
			type: 'dimension',
			label: 'Dimension',
			config: {
				dataset: 'dataset',
			},
			required: true,
			category: 'Chart Data',
		},
		{ ...title },
		{ ...description },
		{ ...showLegend },
		{ ...maxLegendItems },
		{ ...showToolTips },
		{ ...showValueLabels },
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
				measures: [inputs.measure],
				dimensions: [inputs.dimension],
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
