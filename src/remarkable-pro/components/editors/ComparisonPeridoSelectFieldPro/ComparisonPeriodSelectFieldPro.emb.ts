import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value } from '@embeddable.com/core';
import DateTimeSelectFieldPro from './index';
import { description, placeholder, title } from '../../component.constants';
import ComparisonPeriodType from '../../types/ComparisonPeriod.type.emb';

export const meta = {
  name: 'DateComparisonSelectFieldPro',
  label: 'Date Comparison Select Field',
  category: 'Dropdowns',
  defaultWidth: 300,
  defaultHeight: 120,
  inputs: [
    { ...title },
    { ...description },
    { ...placeholder, defaultValue: 'Select a date-comparison' },
    {
      name: 'primaryDateRange',
      type: 'timeRange',
      label: 'Primary Date Range',
      category: 'Pre-configured variables',
    },
    {
      name: 'comparisonPeriod',
      type: ComparisonPeriodType,
      label: 'Selected Comparison Period',
      category: 'Pre-configured variables',
    },
  ],
  events: [
    {
      name: 'onChange',
      label: 'selected comparison-period updated',
      properties: [
        {
          name: 'value',
          label: 'selected comparison-period',
          type: ComparisonPeriodType,
        },
      ],
    },
  ],
  variables: [
    {
      name: 'comparison-period value',
      type: ComparisonPeriodType,
      defaultValue: Value.noFilter(),
      inputs: ['comparisonPeriod'],
      events: [{ name: 'onChange', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(DateTimeSelectFieldPro, meta, {
  /* @ts-expect-error - to be fixed in @embeddable.com/react */
  props: (inputs: Inputs<typeof meta>) => inputs,
  events: {
    onChange: (value) => {
      return {
        value: value || Value.noFilter(),
      };
    },
  },
});
