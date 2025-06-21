// Embeddable Libraries
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value, TimeRange } from '@embeddable.com/core';

//Local Libraries
import RelativeDateDropdown from './index';
import { title, description, placeholder } from '../../../constants/commonChartInputs';
import { forceUtc } from '../../../utils/dateUtils';

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
			name: 'Date period',
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
		onChangeSelectedValue: (range) => {
			return {
				value: range
					? {
							from: forceUtc(range.from),
							to: forceUtc(range.to),
							relativeTimeString: '', // This is prioritised over the from and to dates, so we don't pass this for now (as we don't want Cube parsing this instead of using the calculated dates)
						}
					: Value.noFilter(),
			};
		},
	},
});
