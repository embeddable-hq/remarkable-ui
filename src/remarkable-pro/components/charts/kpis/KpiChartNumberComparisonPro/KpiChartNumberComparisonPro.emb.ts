import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimensionTime,
  genericBoolean,
  genericNumber,
  genericTimeRange,
  measure,
  title,
} from '../../../component.constants';
import KpiChartNumberComparisonPro from './index';
import { loadData, TimeRange } from '@embeddable.com/core';
import ComparisonPeriodType from '../../../types/ComparisonPeriod.type.emb';

export const meta = {
  name: 'KpiChartNumberComparisonPro',
  label: 'Kpi Chart - Number Comparison',
  category: 'Kpi Charts',
  inputs: [
    dataset,
    measure,
    { ...dimensionTime, name: 'timeProperty', label: 'Time Property' },
    {
      ...genericTimeRange,
      name: 'primaryDateRange',
      label: 'Primary Date Range',
      category: 'Component Data',
    },
    {
      name: 'comparisonPeriod',
      type: ComparisonPeriodType,
      label: 'Comparison Period',
      category: 'Component Data',
    },
    title,
    description,
    {
      ...genericBoolean,
      name: 'displayChangeAsPercentage',
      label: 'Display Change as %',
      defaultValue: false,
    },
    {
      ...genericBoolean,
      name: 'reversePositiveNegativeColors',
      label: 'Reverse Positive/Negative Colors',
      defaultValue: false,
    },
    { ...genericNumber, name: 'fontSize', label: 'Font Size', defaultValue: 44, required: true },
  ],
} as const satisfies EmbeddedComponentMeta;

type KpiChartNumberComparisonProState = {
  comparisonDateRange?: TimeRange;
};

export default defineComponent(KpiChartNumberComparisonPro, meta, {
  /* @ts-expect-error - to be fixed in @embeddable.com/react */
  props: (
    inputs: Inputs<typeof meta>,
    [state, setState]: [
      KpiChartNumberComparisonProState,
      (state: KpiChartNumberComparisonProState) => void,
    ],
  ) => {
    return {
      ...inputs,
      setComparisonDateRange: (comparisonDateRange: TimeRange) => setState({ comparisonDateRange }),
      results: loadData({
        from: inputs.dataset,
        select: [inputs.measure],
        filters: inputs.timeProperty
          ? [
              {
                property: inputs.timeProperty,
                operator: 'inDateRange',
                value: inputs.primaryDateRange,
              },
            ]
          : undefined,
      }),
      resultsComparison: state?.comparisonDateRange
        ? loadData({
            from: inputs.dataset,
            select: [inputs.measure],
            filters: [
              {
                property: inputs.timeProperty,
                operator: 'inDateRange',
                value: state.comparisonDateRange,
              },
            ],
          })
        : undefined,
    };
  },
});
