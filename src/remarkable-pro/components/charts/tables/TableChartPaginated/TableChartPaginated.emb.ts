import { loadData } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import TablePaginatedChart from './index';
import { dataset, description, title, dimensionsAndMeasures } from '../../../component.constants';

export const meta = {
  name: 'TableChartPaginated',
  label: 'Table Chart - Paginated',
  category: 'Table Charts',
  inputs: [dataset, { ...dimensionsAndMeasures, label: 'Columns' }, title, description],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(TablePaginatedChart, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: inputs.dimensionsAndMeasures,
      }),
    };
  },
});
