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
  genericBoolean,
} from '../../../component.constants';
import ColorType from '../../../../editors/ColorEditor/Color.type.emb';

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

    {
      type: ColorType,
      name: 'maxColor',
      label: 'Max Color',
      defaultValue: 'green',
      required: true,
      category: 'Component Settings',
    },
    {
      type: ColorType,
      name: 'midColor',
      label: 'Mid Color',
      defaultValue: 'yellow',
      required: true,
      category: 'Component Settings',
    },
    {
      type: ColorType,
      name: 'minColor',
      label: 'Min Color',
      defaultValue: 'red',
      required: true,
      category: 'Component Settings',
    },

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
      name: 'firstColumnWidth',
      label: 'First Column Width',
      description: 'Set the width in px (e.g. 200)',
    },
    {
      ...genericNumber,
      name: 'columnWidth',
      label: 'Column Width',
      description: 'Set the width in px (e.g. 200)',
    },
    maxResults,
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(HeatMapPro, meta, {
  /* @ts-expect-error - to be fixed in @embeddable.com/react */
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
