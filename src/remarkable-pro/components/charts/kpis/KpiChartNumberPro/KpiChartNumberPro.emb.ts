import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { dataset, description, genericNumber, measure, title } from '../../../component.constants';
import KpiChartNumberPro from './index';
import { loadData } from '@embeddable.com/core';

export const meta = {
  name: 'KpiChartNumberPro',
  label: 'Kpi Chart - Number',
  category: 'Kpi Charts',
  inputs: [
    dataset,
    measure,
    title,
    description,
    { ...genericNumber, name: 'fontSize', label: 'Font Size' },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(KpiChartNumberPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [inputs.measure],
      }),
    };
  },
});
