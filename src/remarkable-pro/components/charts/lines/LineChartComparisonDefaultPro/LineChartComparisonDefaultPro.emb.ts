import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import {
  dataset,
  description,
  dimension,
  dimensionTime,
  genericBoolean,
  genericTimeRange,
  maxResults,
  measures,
  reverseXAxis,
  showLegend,
  showLogarithmicScale,
  showTooltips,
  showValueLabels,
  title,
  xAxisLabel,
  yAxisLabel,
  yAxisRangeMax,
  yAxisRangeMin,
} from '../../../component.constants';
import LineChartComparisonDefaultPro from './index';
import { loadData, OrderBy, TimeRange, Value } from '@embeddable.com/core';
import ComparisonPeriodType from '../../../types/ComparisonPeriod.type.emb';
import { LineChartProOptionsClickArg } from '../lines.utils';
import ColorType from '../../../../editors/ColorEditor/Color.type.emb';

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
        {
          type: ColorType,
          category: 'Component Settings',
          name: 'lineColor',
          label: 'Line color',
        },
        {
          type: ColorType,
          category: 'Component Settings',
          name: 'previousLineColor',
          label: 'Previous line color',
        },
        {
          ...genericBoolean,
          name: 'lineDashed',
          label: 'Primary line dashed',
          defaultValue: false,
        },
        {
          ...genericBoolean,
          name: 'previousLineDashed',
          label: 'Compared line dashed',
          defaultValue: true,
        },
        { ...genericBoolean, name: 'connectGaps', label: 'Connect gaps', defaultValue: true },
      ],
    },
    { ...dimension, label: 'X-axis', name: 'xAxis' },
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
    {
      ...dimensionTime,
      name: 'timePropertyForNonTimeDimensions',
      label: 'Time property for non time dimensions',
      description:
        'Choose the time property used for filtering comparison ranges. This will be ignored if your x-axis is already time-based.',
      required: false,
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
    {
      ...genericBoolean,
      name: 'showComparisonAxis',
      label: 'Display a comparison X-axis',
      defaultValue: true,
    },
    maxResults,
  ],
  events: [
    {
      name: 'onLineClicked',
      label: 'A line is clicked',
      properties: [
        {
          name: 'axisDimensionValue',
          label: 'Clicked Axis Dimension Value',
          type: 'string',
        },
      ],
    },
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
    const orderBy: OrderBy[] = [
      {
        property: inputs.xAxis,
        direction: 'asc',
      },
    ];

    const timeProperty =
      inputs.xAxis.nativeType === 'time' ? inputs.xAxis : inputs.timePropertyForNonTimeDimensions;

    return {
      ...inputs,
      comparisonDateRange: state?.comparisonDateRange,
      setComparisonDateRange: (comparisonDateRange: TimeRange) => setState({ comparisonDateRange }),
      results: loadData({
        limit: inputs.maxResults,
        from: inputs.dataset,
        select: [...inputs.measures, inputs.xAxis],
        orderBy,
        filters:
          inputs.primaryDateRange && timeProperty
            ? [
                {
                  property: timeProperty,
                  operator: 'inDateRange',
                  value: inputs.primaryDateRange,
                },
              ]
            : undefined,
      }),
      resultsComparison:
        inputs.primaryDateRange && timeProperty && state?.comparisonDateRange
          ? loadData({
              limit: inputs.maxResults,
              from: inputs.dataset,
              select: [...inputs.measures, inputs.xAxis],
              orderBy,
              filters: [
                {
                  property: timeProperty,
                  operator: 'inDateRange',
                  value: state.comparisonDateRange,
                },
              ],
            })
          : undefined,
    };
  },
  events: {
    onLineClicked: (value: LineChartProOptionsClickArg) => {
      return {
        axisDimensionValue: value.dimensionValue || Value.noFilter(),
      };
    },
  },
});
