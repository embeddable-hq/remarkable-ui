import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimension,
  genericBoolean,
  measures,
  title,
} from '../../../component.constants';
import KpiChartNumberPro from './index';
import { loadData } from '@embeddable.com/core';

export const meta = {
  name: 'LineChartDefaultPro',
  label: 'Line Chart - Default',
  category: 'Line Charts',
  inputs: [
    dataset,
    {
      ...measures,
      inputs: [
        ...measures.inputs,
        { ...genericBoolean, name: 'fillUnderLine', label: 'Fill under line', default: false },
      ],
    },
    dimension,
    title,
    description,
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(KpiChartNumberPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
      results: loadData({
        from: inputs.dataset,
        select: [inputs.measures, inputs.dimension],
      }),
    };
  },
});
