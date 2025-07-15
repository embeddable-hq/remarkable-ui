// Embeddable Libraries
import { DataResponse, Dimension, Measure, Value, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

//Local Libraries
import { ExportOptionFlags } from '../../../shared/ExportButton/nativeOptions';

// Local Libraries
import {
	dataset,
	description,
	dimension,
	exportOptions,
	maxLegendItems,
	measure,
	showLegend,
	showToolTips,
	showValueLabels,
	title,
} from '../../../constants/commonChartInputs';
import PieChartDonut from './index';

export type PieChartDonutProps = {
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
} & ExportOptionFlags;

export const meta = {
	name: 'PieChartDonut',
	label: 'Pie Chart Donut',
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

export default defineComponent(PieChartDonut, meta, {
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
