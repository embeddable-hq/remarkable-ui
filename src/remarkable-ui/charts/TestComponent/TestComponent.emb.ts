import { OrderBy, loadData } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

import Component from './index';

export type TestComponentProps = {
	title: string;
	description: string;
	errorMessage: string;
	noResults: boolean;
	loading: boolean;
};

export const meta = {
	name: 'TestComponent',
	label: 'Test Component',
	category: 'Charts',
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
			name: 'errorMessage',
			type: 'string',
			label: 'error message',
			category: 'States',
		},
		{
			name: 'noResults',
			type: 'boolean',
			label: 'no results',
			category: 'States',
		},
		{
			name: 'loading',
			type: 'boolean',
			label: 'loading',
			category: 'States',
		},
	],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(Component, meta, {
	props: (inputs: Inputs<typeof meta>) => {
		return {
			...inputs,
		};
	},
});
