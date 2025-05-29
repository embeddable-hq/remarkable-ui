
export const dataset = {
    name: 'dataset',
    type: 'dataset',
    label: 'Dataset',
    required: true,
    category: 'Dropdown Data'
} as const;

export const dimension = {
    name: 'dimension',
    type: 'dimension',
    label: 'Dimension',
    config: {
        dataset: 'dataset',
    },
    required: true,
    category: 'Dropdown Data'
} as const;


export const title = {
    name: 'title',
    type: 'string' as 'string',
    label: 'Title',
    category: 'Chart Header'
} as const;

export const description = {
    name: 'description',
    type: 'string' as 'string',
    label: 'Description',
    category: 'Chart Header'
} as const;

export const showLegend = {
    name: 'showLegend',
    type: 'boolean' as 'boolean',
    label: 'Show Legend',
    defaultValue: true,
    category: 'Chart Settings'
} as const;

export const showToolTips = {
    name: 'showTooltips',
    type: 'boolean' as 'boolean',
    label: 'Show Tooltips',
    defaultValue: true,
    category: 'Chart Settings'
} as const;

export const showValueLabels = {
    name: 'showValueLabels',
    type: 'boolean' as 'boolean',
    label: 'Show Value Labels',
    defaultValue: true,
    category: 'Chart Settings'
} as const;

export const maxLegendItems = {
    name: 'maxLegendItems',
    type: 'number' as 'number',
    label: 'Max Legend Items',
    defaultValue: 10,
    category: 'Chart Settings'
} as const;

export const placeholder = {
    name: 'placeholder',
    type: 'string' as 'string',
    label: 'Placeholder',
    category: 'Chart Settings'
} as const;