// ATENTION: THESE OBJECTS SHOULD NEVER BE TOUCHED

import AlignType from './types/Align.type.emb';

// Generics
export const genericBoolean = {
  name: 'boolean',
  type: 'boolean',
  label: 'Boolean',
  category: 'Component Settings',
} as const;

export const genericTimeRange = {
  name: 'timeRange',
  type: 'timeRange',
  label: 'Time Range',
  category: 'Component Settings',
} as const;

export const genericNumber = {
  name: 'number',
  type: 'number',
  label: 'Number',
  category: 'Component Settings',
} as const;

export const genericString = {
  name: 'string',
  type: 'string',
  label: 'String',
  category: 'Component Settings',
} as const;

export const subInputWidth = {
  ...genericNumber,
  name: 'width',
  label: 'Width',
  description: 'You can input a number in pixels e.g. 400',
};

export const subInputAlign = {
  name: 'align',
  type: AlignType,
  label: 'Align',
  category: 'Component Settings',
};

export const subInputPrefix = {
  name: 'prefix',
  type: 'string',
  label: 'Prefix',
  description: 'Prefix',
} as const;

export const subInputSuffix = {
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

export const subInputGenericBoolean = {
  name: 'boolean',
  type: 'boolean',
  defaultValue: false,
  label: 'Boolean',
} as const;

export const subInputGenericNumber = {
  name: 'number',
  type: 'number',
  label: 'Number',
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
  description: 'e.g. EUR',
} as const;

// TODO: Update SDK to export the needed types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subInputAbbreviateLargeNumber: any = {
  name: 'abbreviateLargeNumber',
  type: 'boolean',
  label: 'Abbreviate large number',
  supportedTypes: ['number'],
} as const;

// TODO: Update SDK to export the needed types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subInputDateBounds: any = {
  name: 'dateBounds',
  type: 'timeRange',
  label: 'Date Bounds',
  description: 'Set the date range for the axis',
  supportedTypes: ['time'],
} as const;

// TODO: Update SDK to export the needed types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const subInputGranularity: any = {
  name: 'granularity',
  type: 'granularity',
  label: 'Granularity',
  supportedTypes: ['time'],
  defaultValue: 'day',
} as const;

const subInputs = [
  subInputPrefix,
  subInputSuffix,
  subInputDisplayName,
  subInputMaxCharacters,
  subInputDecimalPlaces,
  subInputCurrency,
  subInputAbbreviateLargeNumber,
];

export const timeDimensionSubInputs = [
  subInputPrefix,
  subInputSuffix,
  subInputDisplayName,
  subInputMaxCharacters,
  subInputDecimalPlaces,
  subInputCurrency,
  subInputAbbreviateLargeNumber,
  subInputGranularity,
  subInputDateBounds,
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

export const dimensionSimple = {
  name: 'dimensionSimple',
  type: 'dimension',
  label: 'Dimension',
  config: {
    dataset: 'dataset',
    hideGranularity: true,
  },
  required: true,
  category: 'Component Data',
} as const;

export const dimensionTime = {
  name: 'dimensionTime',
  type: 'dimension',
  label: 'Dimension Time',
  config: {
    dataset: 'dataset',
    supportedTypes: ['time'],
    hideGranularity: true,
  },
  required: true,
  category: 'Component Data',
} as const;

export const dimensionWithDateBounds = {
  name: 'dimension',
  type: 'dimension',
  label: 'Dimension',
  config: {
    dataset: 'dataset',
  },
  required: true,
  category: 'Component Data',
  inputs: timeDimensionSubInputs,
} as const;

export const dimensions = {
  name: 'dimensions',
  type: 'dimension',
  label: 'Dimensions',
  config: {
    dataset: 'dataset',
  },
  required: true,
  category: 'Component Data',
  inputs: subInputs,
} as const;

export const dimensionOrMeasure = {
  name: 'dimensionOrMeasure',
  type: 'dimensionOrMeasure',
  label: 'Dimension or Measure',
  config: {
    dataset: 'dataset',
  },
  category: 'Component Data',
  inputs: subInputs,
} as const;

export const dimensionsAndMeasures = {
  name: 'dimensionsAndMeasures',
  type: 'dimensionOrMeasure',
  label: 'Dimensions and Measures',
  array: true,
  required: true,
  config: {
    dataset: 'dataset',
  },
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

export const measures = {
  name: 'measures',
  type: 'measure',
  label: 'Measures',
  array: true,
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

export const maxResults = {
  name: 'maxResults',
  type: 'number',
  label: 'Max results',
  category: 'Component Settings',
  defaultValue: 1000,
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

export const showTotalLabels = {
  name: 'showTotalLabels',
  type: 'boolean',
  label: 'Show Total Labels',
  defaultValue: false,
  category: 'Component Settings',
} as const;

export const showLogarithmicScale = {
  name: 'showLogarithmicScale',
  type: 'boolean',
  label: 'Show Logarithmic Scale',
  defaultValue: false,
  category: 'Component Settings',
} as const;

export const xAxisLabel = {
  name: 'xAxisLabel',
  type: 'string',
  label: 'X-axis Label',
  category: 'Axes Settings',
} as const;

export const yAxisLabel = {
  name: 'yAxisLabel',
  type: 'string',
  label: 'Y-axis Label',
  category: 'Axes Settings',
} as const;

export const reverseXAxis = {
  name: 'reverseXAxis',
  type: 'boolean',
  label: 'Reverse X-axis',
  defaultValue: false,
  category: 'Axes Settings',
} as const;

export const displayPercentages = {
  name: 'displayPercentages',
  type: 'boolean',
  label: 'Display Percentages',
  defaultValue: false,
  category: 'Component Settings',
} as const;

export const reverseYAxis = {
  name: 'reverseYAxis',
  type: 'boolean',
  label: 'Reverse Y-axis',
  defaultValue: false,
  category: 'Axes Settings',
} as const;

export const yAxisRangeMin = {
  name: 'yAxisRangeMin',
  type: 'number',
  label: 'Y-axis Range Min',
  category: 'Axes Settings',
} as const;

export const yAxisRangeMax = {
  name: 'yAxisRangeMax',
  type: 'number',
  label: 'Y-axis Range Max',
  category: 'Axes Settings',
} as const;

export const xAxisRangeMin = {
  name: 'xAxisRangeMin',
  type: 'number',
  label: 'X-axis Range Min',
  category: 'Axes Settings',
} as const;

export const xAxisRangeMax = {
  name: 'xAxisRangeMax',
  type: 'number',
  label: 'X-axis Range Max',
  category: 'Axes Settings',
} as const;

// TODO: check where this is used
export const xAxisMaxItems = {
  name: 'xAxisMaxItems',
  type: 'number',
  label: 'Max X-axis Items',
  category: 'Axes Settings',
} as const;

export const yAxisMaxItems = {
  name: 'yAxisMaxItems',
  type: 'number',
  label: 'Max Y-axis Items',
  category: 'Axes Settings',
} as const;

export const showTopItems = {
  name: 'showTopItems',
  type: 'number',
  label: 'Show Top Items',
  defaultValue: 10,
  category: 'Component Data',
} as const;

export const maxLegendItems = {
  name: 'maxLegendItems',
  type: 'number',
  label: 'Max Legend Items',
  defaultValue: 10,
  category: 'Component Data',
} as const;

export const placeholder = {
  name: 'placeholder',
  type: 'string',
  label: 'Placeholder',
  category: 'Component Settings',
} as const;
