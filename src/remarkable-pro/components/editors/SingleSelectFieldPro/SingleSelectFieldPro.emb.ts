import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value, loadData } from '@embeddable.com/core';
import { dataset, description, dimension, placeholder, title } from '../../component.constants';
import SingleSelectFieldPro, { MAX_OPTIONS } from '.';

export const meta = {
  name: 'SingleSelectFieldPro',
  label: 'Single Select Field',
  category: 'Dropdowns',
  defaultWidth: 200,
  defaultHeight: 120,
  inputs: [
    dataset,
    { ...dimension, label: 'Dimension (to load Dropdown values)' },
    {
      ...dimension,
      required: false,
      name: 'optionalSecondDimension',
      label: 'Optional second dimension for filtering',
      description:
        'A hidden dimension applied for filtering instead of the main dimension. Must be unique.',
    },
    title,
    description,
    { ...placeholder, defaultValue: 'Select value...' },
    {
      name: 'selectedValue',
      type: 'string',
      label: 'Selected Value',
      category: 'Pre-configured variables',
    },
    {
      name: 'maxOptions',
      type: 'number',
      label: 'Maximum options',
      category: 'Pre-configured variables',
      defaultValue: MAX_OPTIONS,
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
      inputs: ['selectedValue'],
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
    const operator = inputs.dimension.nativeType === 'string' ? 'contains' : 'equals';
    return {
      ...inputs,
      maxOptions: inputs.maxOptions,
      setSearchValue: (searchValue: string) => setState({ searchValue: searchValue }),
      results: loadData({
        limit: inputs.maxOptions,
        from: inputs.dataset,
        select: [inputs.dimension, inputs.optionalSecondDimension].filter(Boolean),
        filters: state?.searchValue
          ? [
              {
                operator,
                property: inputs.dimension,
                value: state.searchValue,
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
