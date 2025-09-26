import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value, loadData } from '@embeddable.com/core';
import { dataset, description, dimension, placeholder, title } from '../../component.constants';
import MultiSelectFieldPro, { MAX_OPTIONS } from '.';

export const meta = {
  name: 'MultiSelectFieldPro',
  label: 'Multi Select Field',
  category: 'Dropdowns',
  defaultWidth: 300,
  defaultHeight: 120,
  inputs: [
    dataset,
    { ...dimension, label: 'Dimension (to load Dropdown values)' },
    title,
    description,
    { ...placeholder, defaultValue: 'Select values...' },
    {
      name: 'maxOptions',
      type: 'number',
      label: 'Maximum options',
      category: 'Component Settings',
      defaultValue: MAX_OPTIONS,
    },
    {
      name: 'selectedValues',
      type: 'string',
      array: true,
      label: 'Selected Values',
      category: 'Pre-configured Variables',
    },
    {
      type: 'dimension',
      config: {
        dataset: 'dataset',
      },
      required: false,
      name: 'optionalSecondDimension',
      label: 'Optional secondary dimension',
      category: 'Data Mapping for Interactions',
      description: 'Send a different dimension to embeddable when the user clicks. Must be unique.',
    },
  ],
  events: [
    {
      name: 'onChange',
      label: 'selected values updated',
      properties: [
        {
          name: 'value',
          label: 'selected values',
          type: 'string',
          array: true,
        },
      ],
    },
  ],
  variables: [
    {
      name: 'multi-select values',
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
