import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value } from '@embeddable.com/core';
import DateTimeSelectFieldPro from './index';
import { description, placeholder, title } from '../../component.constants';
import { localToUtcDate } from '../../../utils.ts/date.utils';

export const meta = {
  name: 'DateTimeSelectFieldPro',
  label: 'Date Time Select Field',
  category: 'Dropdowns',
  defaultWidth: 200,
  defaultHeight: 40,
  inputs: [
    { ...title },
    { ...description },
    { ...placeholder, defaultValue: 'Select value...' },
    {
      name: 'selectedValue',
      type: 'timeRange',
      label: 'Selected Value',
      category: 'Pre-configured variables',
    },
  ],
  events: [
    {
      name: 'onChange',
      label: 'Change',
      properties: [
        {
          name: 'value',
          type: 'timeRange',
        },
      ],
    },
  ],
  variables: [
    {
      name: 'Date-time-select value',
      type: 'timeRange',
      defaultValue: Value.noFilter(),
      inputs: ['selectedValue'],
      events: [{ name: 'onChange', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

export default defineComponent(DateTimeSelectFieldPro, meta, {
  props: (inputs: Inputs<typeof meta>) => {
    return {
      ...inputs,
    };
  },
  events: {
    onChange: (range) => {
      return {
        value: range
          ? {
              from: range.from ? localToUtcDate(range.from) : undefined,
              to: range.to ? localToUtcDate(range.to) : undefined,
              relativeTimeString: '', // This is prioritised over the from and to dates, so we don't pass this for now (as we don't want Cube parsing this instead of using the calculated dates)
            }
          : Value.noFilter(),
      };
    },
  },
});
