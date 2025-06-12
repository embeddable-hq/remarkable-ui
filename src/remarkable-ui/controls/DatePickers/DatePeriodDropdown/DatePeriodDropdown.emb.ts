// Embeddable Libraries
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value, loadData, DataResponse, Dimension, TimeRange } from '@embeddable.com/core';

//Local Libraries
import RelativeDateDropdown from './index';
import { title, description, placeholder } from '../../../constants/commonChartInputs';

export type DatePeriodDropdownProps = {
	description?: string;
	onChangeSelectedValue: (selectedTimeRange: TimeRange) => void;
	placeholder?: string;
	preSelectedValue: TimeRange;
	title?: string;
};

export const meta = {
	name: 'DatePeriodDropdown',
	label: 'Date Period Dropdown',
	category: 'Dropdowns',
	defaultWidth: 200,
	defaultHeight: 40,
	inputs: [
		{ ...title },
		{ ...description },
		{ ...placeholder, defaultValue: 'Select value...' },
		{
			name: 'preSelectedValue',
			type: 'timeRange',
			label: 'Selected Value',
			category: 'Pre-configured variables',
		},
	],
	events: [
		{
			name: 'onChangeSelectedValue',
			label: 'Change',
			properties: [
				{
					name: 'value',
					type: 'timeRange',
				},
			],
		},
	],
	variables: [
		{
			name: 'Date Periods Dropdown value',
			type: 'timeRange',
			defaultValue: Value.noFilter(),
			inputs: ['preSelectedValue'],
			events: [{ name: 'onChangeSelectedValue', property: 'value' }],
		},
	],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(RelativeDateDropdown, meta, {
	props: (inputs: Inputs<typeof meta>) => {
		return {
			...inputs,
		};
	},
	events: {
		onChangeSelectedValue: (selectedTimeRange: string) => {
			return {
				value: selectedTimeRange || Value.noFilter(),
			};
		},
	},
});
