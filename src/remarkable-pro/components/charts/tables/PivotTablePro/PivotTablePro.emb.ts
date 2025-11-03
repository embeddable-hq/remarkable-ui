import { loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import PivotTablePro from './index';
import {
  dataset,
  description,
  title,
  maxResults,
  measures,
  dimension,
  genericBoolean,
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
      ],
    },
    {
      ...dimensionWithDateBounds,
      label: 'Column Dimension',
      name: 'columnDimension',
    },
    {
      ...dimension,
      label: 'Row Dimension',
      name: 'rowDimension',
    },
    title,
    description,
    {
      ...genericBoolean,
      name: 'showColumnPercentages',
      label: 'Show Column Percentages',
      defaultValue: false,
    },
    {
      ...genericNumber,
      name: 'percentageDecimalPlaces',
      label: 'Percentage Decimal Places',
      defaultValue: 1,
    },
    { ...genericBoolean, name: 'showRowTotals', label: 'Show Row Totals' },
    { ...genericString, name: 'displayNullAs', label: 'Display Null As' },
    {
      ...genericNumber,
      name: 'columnWidth',
      label: 'Column Width',
      description: 'You can input a number in pixels e.g. 400',
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
