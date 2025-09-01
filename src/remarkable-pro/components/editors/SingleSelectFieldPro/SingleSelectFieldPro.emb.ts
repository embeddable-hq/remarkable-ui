import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import { Value, loadData } from '@embeddable.com/core';
import { dataset, description, dimension, placeholder, title } from '../../component.constants';
import SingleSelectFieldPro, { MAX_OPTIONS } from '.';

export const meta = {
  name: 'SingleSelectFieldPro',
  label: 'Single Select Field',
  category: 'Dropdowns',
  defaultWidth: 300,
  defaultHeight: 120,
  inputs: [
    dataset,
    { ...dimension, label: 'Dimension (to load Dropdown values)' },
    title,
    description,
    { ...placeholder, defaultValue: 'Select value...' },
    {
      name: 'maxOptions',
      type: 'number',
      label: 'Maximum options',
      category: 'Component Settings',
      defaultValue: MAX_OPTIONS,
    },
    {
      name: 'selectedValue',
      type: 'string',
      label: 'Selected Value',
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
      label: 'selected value updated',
      properties: [
        {
          name: 'value',
          label: 'selected Value',
          type: 'string',
        },
      ],
    },
  ],
  variables: [
    {
      name: 'single-select value',
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
