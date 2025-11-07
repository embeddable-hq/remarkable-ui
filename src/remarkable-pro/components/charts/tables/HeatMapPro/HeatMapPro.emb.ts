import { loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import HeatMapPro from './index';
import {
  dataset,
  description,
  title,
  maxResults,
  genericString,
  dimensionWithDateBounds,
  genericNumber,
  measure,
  inputColor,
  genericBoolean,
} from '../../../component.constants';

export const meta = {
  name: 'HeatMapPro',
  label: 'Heat Map',
  category: 'Table Charts',
  inputs: [
    dataset,
    measure,
    {
      ...dimensionWithDateBounds,
      label: 'Row Dimension',
      name: 'rowDimension',
    },
    {
      ...dimensionWithDateBounds,
      label: 'Column Dimension',
      name: 'columnDimension',
    },
    title,
    description,
    { ...genericString, name: 'displayNullAs', label: 'Display Null As' },
    { ...inputColor, name: 'maxColor', label: 'Max Color', defaultValue: 'green', required: true },
    { ...inputColor, name: 'midColor', label: 'Mid Color', defaultValue: 'yellow', required: true },
    { ...inputColor, name: 'minColor', label: 'Min Color', defaultValue: 'red', required: true },
    {
      ...genericString,
      name: 'minThreshold',
      label: 'Max range lower limit',
      description: 'Enter a value as either a number (e.g. 20) or a percentage (e.g. 20%)',
    },
    {
      ...genericString,
      name: 'maxThreshold',
      label: 'Min range upper limit',
      description: 'Enter a value as either a number (e.g. 20) or a percentage (e.g. 20%)',
    },
    { ...genericBoolean, name: 'showValues', label: 'Show Values', defaultValue: true },
    {
      ...genericNumber,
      name: 'firstColumnMinWidth',
      label: 'First Column MinWidth',
      description: 'Set the minimum width in px (e.g. 200)',
    },
    {
      ...genericNumber,
      name: 'columnMinWidth',
      label: 'Column Min Width',
      description: 'Set the minimum width in px (e.g. 200)',
    },
    maxResults,
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(HeatMapPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [inputs.rowDimension, inputs.columnDimension, inputs.measure],
        limit: inputs.maxResults,
        countRows: true,
      }),
    };
  },
});
