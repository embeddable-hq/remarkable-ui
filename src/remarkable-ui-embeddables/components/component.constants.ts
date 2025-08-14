// ATENTION: THESE OBJECTS SHOULD NEVER BE TOUCHED

export const subInputPrefix = {
  name: 'prefix',
  type: 'string',
  label: 'Prefix',
  description: 'Prefix',
} as const;

export const subInputSufix = {
  name: 'suffix',
  type: 'string',
  label: 'Suffix',
  description: 'Suffix',
} as const;

export const subInputDisplayName = {
  name: 'displayName',
  type: 'string',
  label: 'Display name',
} as const;

// TODO: Update SDK to export the needed types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subInputMaxCharacters: any = {
  name: 'maxCharacters',
  type: 'number',
  label: 'Maximum characters',
  supportedTypes: ['string'],
} as const;

// TODO: Update SDK to export the needed types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subInputDecimalPlaces: any = {
  name: 'decimalPlaces',
  type: 'number',
  label: 'Decimal places',
  supportedTypes: ['number'],
} as const;

// TODO: Update SDK to export the needed types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subInputCurrency: any = {
  name: 'currency',
  type: 'string',
  label: 'Currency',
  supportedTypes: ['number'],
} as const;

// TODO: Update SDK to export the needed types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subInputAbbreviateLargeNumber: any = {
  name: 'abbreviateLargeNumber',
  type: 'boolean',
  label: 'Abbreviate large number',
  supportedTypes: ['number'],
} as const;

const subInputs = [
  subInputPrefix,
  subInputSufix,
  subInputDisplayName,
  subInputMaxCharacters,
  subInputDecimalPlaces,
  subInputCurrency,
  subInputAbbreviateLargeNumber,
];

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
  inputs: subInputs,
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
  inputs: subInputs,
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
