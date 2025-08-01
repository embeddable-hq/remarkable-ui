// ATENTION: THIS OBJECTS SHOULD NEVER BE TOUCHED

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

export const measure = {
  name: 'measure',
  type: 'measure',
  label: 'Measure',
  config: {
    dataset: 'dataset',
  },
  required: true,
  category: 'Component Data',
} as const;

export const title = {
  name: 'title',
  type: 'string',
  label: 'Title',
  category: 'Component Header',
} as const;

export const description = {
  name: 'description',
  type: 'string',
  label: 'Description',
  category: 'Component Header',
} as const;

export const showLegend = {
  name: 'showLegend',
  type: 'boolean',
  label: 'Show Legend',
  defaultValue: true,
  category: 'Component Settings',
} as const;

export const showTooltips = {
  name: 'showTooltips',
  type: 'boolean',
  label: 'Show Tooltips',
  defaultValue: true,
  category: 'Component Settings',
} as const;

export const showValueLabels = {
  name: 'showValueLabels',
  type: 'boolean',
  label: 'Show Value Labels',
  defaultValue: true,
  category: 'Component Settings',
} as const;

export const maxLegendItems = {
  name: 'maxLegendItems',
  type: 'number',
  label: 'Max Legend Items',
  defaultValue: 10,
  category: 'Component Settings',
} as const;

export const placeholder = {
  name: 'placeholder',
  type: 'string',
  label: 'Placeholder',
  category: 'Component Settings',
} as const;
