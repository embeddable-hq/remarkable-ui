import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimensionTime,
  genericBoolean,
  genericString,
  measures,
  reverseXAxis,
  showLegend,
  showLogarithmicScale,
  showTooltips,
  showValueLabels,
  timeDimensionSubInputs,
  title,
  xAxisLabel,
  yAxisLabel,
  yAxisRangeMax,
  yAxisRangeMin,
} from '../../../component.constants';
import LineChartComparisonDefaultPro from './index';
import { loadData, OrderBy, TimeRange } from '@embeddable.com/core';
import ComparisonPeriodType from '../../../types/ComparisonPeriod.type.emb';

export const meta = {
  name: 'LineChartComparisonDefaultPro',
  label: 'Line Chart Comparison - Default',
  category: 'Line Charts',
  inputs: [
    dataset,
    {
      ...measures,
      inputs: [
        ...measures.inputs,
        { ...genericBoolean, name: 'fillUnderLine', label: 'Fill under line' },
        { ...genericString, name: 'lineColor', label: 'Line color' },
        { ...genericString, name: 'previousLineColor', label: 'Previous line color' },
        { ...genericBoolean, name: 'lineDashed', label: 'Line dashed', defaultValue: false },
        {
          ...genericBoolean,
          name: 'previousLineDashed',
          label: 'Previous line dashed',
          defaultValue: true,
        },
        { ...genericBoolean, name: 'connectGaps', label: 'Connect gaps', defaultValue: true },
      ],
    },
    { ...dimensionTime, inputs: timeDimensionSubInputs },
    {
      name: 'comparisonPeriod',
      type: ComparisonPeriodType,
      label: 'Comparison Period',
      description: 'You can also connect this to a comparison period selector using its variable',
      category: 'Component Data',
      // required: true,
    },

    title,
    description,
    showLegend,
    showTooltips,
    showValueLabels,
    showLogarithmicScale,
    xAxisLabel,
    yAxisLabel,
    reverseXAxis,
    yAxisRangeMin,
    yAxisRangeMax,
  ],
} as const satisfies EmbeddedComponentMeta;

type LineChartComparisonDefaultProState = {
  comparisonDateRange: TimeRange;
};

export default defineComponent(LineChartComparisonDefaultPro, meta, {
  /* @ts-expect-error - to be fixed in @embeddable.com/react */
  props: (
    inputs: Inputs<typeof meta>,
    [state, setState]: [
      LineChartComparisonDefaultProState,
      (state: LineChartComparisonDefaultProState) => void,
    ],
  ) => {
    const dimensionTimeDateBoundsRelativeTimeString =
      inputs.dimensionTime.inputs?.['dateBounds']?.relativeTimeString;

    const orderBy: OrderBy[] = [
      {
        property: inputs.dimensionTime,
        direction: 'asc',
      },
    ];
    return {
      ...inputs,
      comparisonDateRange: state?.comparisonDateRange,
      setComparisonDateRange: (comparisonDateRange: TimeRange) => setState({ comparisonDateRange }),
      results: loadData({
        from: inputs.dataset,
        select: [...inputs.measures, inputs.dimensionTime],
        orderBy,
        filters: dimensionTimeDateBoundsRelativeTimeString
          ? [
              {
                property: inputs.dimensionTime,
                operator: 'inDateRange',
                value: dimensionTimeDateBoundsRelativeTimeString,
              },
            ]
          : undefined,
      }),
      resultsComparison:
        inputs.dimensionTime && state?.comparisonDateRange
          ? loadData({
              from: inputs.dataset,
              select: [...inputs.measures, inputs.dimensionTime],
              orderBy,
              filters: [
                {
                  property: inputs.dimensionTime,
                  operator: 'inDateRange',
                  value: state.comparisonDateRange,
                },
              ],
            })
          : undefined,
    };
  },
});
