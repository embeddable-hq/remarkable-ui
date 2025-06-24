// Embeddable Libraries
import { DataResponse, Dimension, Measure, Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';

// Local Libraries
import {
	description,
	exportOptions,
	maxLegendItems,
	showLegend,
	showToolTips,
	showValueLabels,
	title,
} from '../../../constants/commonChartInputs';
import DonutChartWithLabel from './index';
import { ExportOptionFlags } from '../../../shared/ExportButton/nativeOptions';

export type DonutChartWithLabelProps = {
	description?: string;
	dimension: Dimension;
	innerLabelMeasure: Measure;
	innerLabelText?: string;
	maxLegendItems?: number;
	measure: Measure;
	onSegmentClick: (args: { dimensionValue: string | null }) => void;
	results: DataResponse;
	resultsInnerLabel: DataResponse;
	showLegend?: boolean;
	showTooltips?: boolean;
	showValueLabels?: boolean;
	title?: string;
} & ExportOptionFlags;

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
			category: 'Chart Data',
		},
		{
			name: 'measure',
			type: 'measure' as 'measure',
			label: 'Measure',
			config: {
				dataset: 'dataset', // restricts measure options to the selected dataset
			},
			required: true,
			category: 'Chart Data',
		},
		{
			name: 'dimension',
			type: 'dimension' as 'dimension',
			label: 'Dimension',
			config: {
				dataset: 'dataset',
			},
			required: true,
			category: 'Chart Data',
		},
		{
			name: 'innerLabelMeasure',
			type: 'measure',
			label: 'Inner Label Measure',
			config: {
				dataset: 'dataset',
			},
			required: true,
			category: 'Chart Data',
		},
		{
			name: 'innerLabelText',
			type: 'string',
			label: 'Inner Label Text',
			description: 'Text to display inside the donut chart',
			required: false,
			category: 'Chart Data',
		},
		{ ...title },
		{ ...description },
		{ ...showLegend },
		{ ...maxLegendItems },
		{ ...showToolTips },
		{ ...showValueLabels },
		...exportOptions,
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
				measures: [inputs.innerLabelMeasure],
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
