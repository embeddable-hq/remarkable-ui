import { loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import PivotTablePro from './index';
import {
  dataset,
  description,
  title,
  maxResults,
  measures,
  subInputGenericBoolean,
  genericString,
  dimensionWithDateBounds,
  genericNumber,
} from '../../../component.constants';

export const meta = {
  name: 'PivotTablePro',
  label: 'Pivot Table',
  category: 'Table Charts',
  inputs: [
    dataset,
    {
      ...measures,
      label: 'Measures To Display',
      inputs: [
        ...measures.inputs,
        {
          ...subInputGenericBoolean,
          name: 'showColumnTotal',
          label: 'Show Column Total',
        },
        {
          ...subInputGenericBoolean,
          name: 'showRowTotal',
          label: 'Show Row Total',
        },
        {
          ...subInputGenericBoolean,
          name: 'showAsPercentage',
          label: 'Show As Percentage',
          description: 'If turned on, other measures may be ignored',
          defaultValue: false,
        },
      ],
    },
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

export default defineComponent(PivotTablePro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,

      results: loadData({
        from: inputs.dataset,
        select: [inputs.rowDimension, inputs.columnDimension, ...inputs.measures],
        limit: inputs.maxResults,
        countRows: true,
      }),
    };
  },
});
