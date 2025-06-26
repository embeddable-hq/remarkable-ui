// Embeddable Libraries
import { DataResponse, Dimension, Measure, Value, loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';

// Local Libraries
import {
	dataset,
	dimension,
	measure,
	description,
	exportOptions,
	maxLegendItems,
	showLegend,
	showToolTips,
	showValueLabels,
	title,
} from '../../../constants/commonChartInputs';
import PieChartDonutWithLabel from './index';
import { ExportOptionFlags } from '../../../shared/ExportButton/nativeOptions';

export type PieChartDonutWithLabelProps = {
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
	name: 'PieChartDonutWithLabel',
	label: 'Pie Chart Donut With Label',
	category: 'Pie Charts',
	inputs: [
		{ ...dataset },
		{ ...measure },
		{ ...dimension },
		{ ...measure, name: 'innerLabelMeasure', label: 'Inner Label Measure' },
		{
			name: 'innerLabelText',
			type: 'string',
			label: 'Inner Label Text',
			description: 'Text to display inside the donut chart',
			required: false,
			category: 'Component Data',
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

export default defineComponent(PieChartDonutWithLabel, meta, {
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
