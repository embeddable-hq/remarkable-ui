import { ExportOptionKey } from '../shared/ExportButton/nativeOptions';

export const dataset = {
	name: 'dataset',
	type: 'dataset',
	label: 'Dataset',
	required: true,
	category: 'Component Data',
} as const;

export const dimension = {
	name: 'dimension',
	type: 'dimension',
	label: 'Dimension',
	config: {
		dataset: 'dataset',
	},
	required: true,
	category: 'Component Data',
} as const;

export const title = {
	name: 'title',
	type: 'string' as 'string',
	label: 'Title',
	category: 'Component Header',
} as const;

export const description = {
	name: 'description',
	type: 'string' as 'string',
	label: 'Description',
	category: 'Component Header',
} as const;

export const showLegend = {
	name: 'showLegend',
	type: 'boolean' as 'boolean',
	label: 'Show Legend',
	defaultValue: true,
	category: 'Component Settings',
} as const;

export const showToolTips = {
	name: 'showTooltips',
	type: 'boolean' as 'boolean',
	label: 'Show Tooltips',
	defaultValue: true,
	category: 'Component Settings',
} as const;

export const showValueLabels = {
	name: 'showValueLabels',
	type: 'boolean' as 'boolean',
	label: 'Show Value Labels',
	defaultValue: true,
	category: 'Component Settings',
} as const;

export const maxLegendItems = {
	name: 'maxLegendItems',
	type: 'number' as 'number',
	label: 'Max Legend Items',
	defaultValue: 10,
	category: 'Component Settings',
} as const;

export const placeholder = {
	name: 'placeholder',
	type: 'string' as 'string',
	label: 'Placeholder',
	category: 'Component Settings',
} as const;

export const downloadCSV = {
	name: 'downloadCSV' as ExportOptionKey,
	type: 'boolean' as 'boolean',
	label: 'Enable download as CSV',
	defaultValue: true,
	category: 'Export Options',
} as const;

export const downloadPNG = {
	name: 'downloadPNG' as ExportOptionKey,
	type: 'boolean' as 'boolean',
	label: 'Enable download as PNG',
	defaultValue: true,
	category: 'Export Options',
} as const;
