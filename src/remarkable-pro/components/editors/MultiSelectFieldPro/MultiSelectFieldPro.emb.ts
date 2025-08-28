import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value, loadData } from '@embeddable.com/core';
import { dataset, description, dimension, placeholder, title } from '../../component.constants';
import MultiSelectFieldPro, { MAX_OPTIONS } from '.';

export const meta = {
  name: 'MultiSelectFieldPro',
  label: 'Multi Select Field',
  category: 'Dropdowns',
  defaultWidth: 200,
  defaultHeight: 40,
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
      name: 'selectedValues',
      type: 'string',
      array: true,
      label: 'Selected Values',
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
          array: true,
        },
      ],
    },
  ],
  variables: [
    {
      name: 'Multi-select values',
      type: 'string',
      array: true,
      defaultValue: Value.noFilter(),
      inputs: ['selectedValues'],
      events: [{ name: 'onChange', property: 'value' }],
    },
  ],
} as const satisfies EmbeddedComponentMeta;

type MultiSelectDropdownState = {
  searchValue?: string;
};

export default defineComponent(MultiSelectFieldPro, meta, {
  props: (
    inputs: Inputs<typeof meta>,
    [state, setState]: [MultiSelectDropdownState, (state: MultiSelectDropdownState) => void],
  ) => {
    const operator = inputs.dimension.nativeType === 'string' ? 'contains' : 'equals';
    return {
      ...inputs,
      maxOptions: inputs.maxOptions,
      setSearchValue: (searchValue: string) => setState({ searchValue }),
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
    onChange: (selectedValues: string[]) => {
      return {
        value: selectedValues.length ? selectedValues : Value.noFilter(),
      };
    },
  },
});
