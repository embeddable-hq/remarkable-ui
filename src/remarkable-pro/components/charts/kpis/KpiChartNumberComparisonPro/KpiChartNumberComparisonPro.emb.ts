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
      description: 'You can also connect this to a date range selector using its variable',
      category: 'Component Data',
    },
    {
      name: 'comparisonPeriod',
      type: ComparisonPeriodType,
      label: 'Comparison Period',
      description: 'You can also connect this to a comparison period selector using its variable',
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
      ...genericNumber,
      name: 'percentageDecimalPlaces',
      label: 'Percentage Decimal Places',
      defaultValue: 1,
    },
    {
      ...genericBoolean,
      name: 'reversePositiveNegativeColors',
      label: 'Reverse Positive/Negative Colors',
      defaultValue: false,
    },
    { ...genericNumber, name: 'fontSize', label: 'Font Size' },
    {
      ...genericNumber,
      name: 'changeFontSize',
      label: 'Change Font Size',
    },
  ],
} as const satisfies EmbeddedComponentMeta;

type KpiChartNumberComparisonProState = {
  comparisonDateRange: TimeRange;
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
      comparisonDateRange: state?.comparisonDateRange,
      setComparisonDateRange: (comparisonDateRange: TimeRange) => setState({ comparisonDateRange }),
      results: loadData({
        from: inputs.dataset,
        select: [inputs.measure],
        limit: 1,
        filters:
          inputs.primaryDateRange && inputs.timeProperty
            ? [
                {
                  property: inputs.timeProperty,
                  operator: 'inDateRange',
                  value: inputs.primaryDateRange,
                },
              ]
            : undefined,
      }),
      resultsComparison:
        inputs.primaryDateRange && inputs.timeProperty && state?.comparisonDateRange
          ? loadData({
              from: inputs.dataset,
              select: [inputs.measure],
              limit: 1,
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
