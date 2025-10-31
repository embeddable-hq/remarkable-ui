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
} from '../../../component.constants';

export const meta = {
  name: 'PivotTablePro',
  label: 'Pivot Table',
  category: 'Table Charts',
  inputs: [
    dataset,
    {
      ...measures,
      label: 'Measures to display',
      inputs: [
        ...measures.inputs,
        {
          ...subInputGenericBoolean,
          name: 'showColumnTotal',
          label: 'Show column total',
        },
      ],
    },
    {
      ...dimension,
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
      label: 'Show column percentages',
      defaultValue: false,
    },
    { ...genericBoolean, name: 'showRowTotals', label: 'Show row totals' },
    { ...genericString, name: 'displayNullAs', label: 'Display null as' },

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
