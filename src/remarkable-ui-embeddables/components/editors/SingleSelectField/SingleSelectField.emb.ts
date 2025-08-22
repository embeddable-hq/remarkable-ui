// Embeddable Libraries
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value, loadData } from '@embeddable.com/core';
import { dataset, description, dimension, placeholder, title } from '../../component.constants';
import SingleSelectFieldPro from '.';

export const meta = {
  name: 'SingleSelectField',
  label: 'Single Select Field',
  category: 'Dropdowns',
  defaultWidth: 200,
  defaultHeight: 40,
  inputs: [
    dataset,
    { ...dimension, label: 'Dimension (to load Dropdown values)' },
    title,
    description,
    { ...placeholder, defaultValue: 'Select value...' },
    {
      name: 'value',
      type: 'string',
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
          type: 'string',
        },
      ],
    },
  ],
  variables: [
    {
      name: 'Single-select value',
      type: 'string',
      defaultValue: Value.noFilter(),
      inputs: ['value'],
      events: [{ name: 'onChange', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

type SingleSelectDropdownState = {
  searchValue?: string;
};

export default defineComponent(SingleSelectFieldPro, meta, {
  props: (
    inputs: Inputs<typeof meta>,
    [state, setState]: [SingleSelectDropdownState, (state: SingleSelectDropdownState) => void],
  ) => {
    return {
      ...inputs,
      setSearchValue: (searchValue: string) => setState({ searchValue: searchValue }),
      results: loadData({
        limit: 200,
        from: inputs.dataset,
        select: [inputs.dimension],
        filters: state?.searchValue
          ? [
              {
                operator: 'contains',
                property: inputs.dimension,
                value: state?.searchValue,
              },
            ]
          : undefined,
      }),
    };
  },
  events: {
    onChange: (selectedValue: string) => {
      return {
        value: selectedValue || Value.noFilter(),
      };
    },
  },
});
