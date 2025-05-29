// Embeddable Libraries
import { Value, loadData, DataResponse, Dimension } from '@embeddable.com/core';
import { EmbeddedComponentMeta, Inputs, defineComponent } from '@embeddable.com/react';

// Local Libraries
import { title, description, placeholder, dataset, dimension } from '../../../constants/commonChartInputs';
import MultiSelectDropdown from './index';

export type MultiSelectDropdownProps = {
    description?: string;
    dimension: Dimension;
    onChangeSelectedValues?: (selectedValues: string[]) => void;
    placeholder?: string;
    results: DataResponse;
    preSelectedValues: string[];
    setSearchValue: (search: string) => void;
    title?: string;
}

export const meta = {
    name: 'MultiSelectDropdown',
    label: 'Multi-select dropdown',
    category: 'Dropdowns',
    defaultHeight: 125,
    defaultWidth: 250,
    inputs: [
        {...dataset},
        {...dimension, label: 'Dimension (to load Dropdown values)'},
        {...title},
        {...description},
        {...placeholder, defaultValue: 'Select values...'},
        {
            name: 'preSelectedValues',
            type: 'string',
            array: true,
            label: 'Selected Values',
            category: 'Pre-configured variables'
        },
    ],
    events: [
        {
          name: 'onChangeSelectedValues',
          label: 'Change',
          properties: [
            {
              name: 'value',
              type: 'string',
              array: true
            }
          ]
        }
      ],
    variables: [
        {
          name: 'Multi-select dropdown values',
          type: 'string',
          defaultValue: Value.noFilter(),
          array: true,
          inputs: ['preSelectedValues'],
          events: [{ name: 'onChangeSelectedValues', property: 'value' }]
        }
    ]
} as const satisfies EmbeddedComponentMeta;

type MultiSelectDropdownState = {
    searchValue?: string;
};

export default defineComponent(MultiSelectDropdown, meta, {
    props: (inputs: Inputs<typeof meta>, [state, setState]: [MultiSelectDropdownState, (state: MultiSelectDropdownState) => void]) => {

        return {
            ...inputs,
            setSearchValue: (searchValue: string) => setState({ searchValue: searchValue }),
            results: loadData({
                from: inputs.dataset,
                dimensions: [inputs.dimension],
                limit: 200,
                filters:
                    state?.searchValue
                        ? [
                            {
                            operator: 'contains',
                            property: inputs.dimension,
                            value: state?.searchValue
                            }
                        ]
                        : undefined
            })
        };
    },
    events: {
        onChangeSelectedValues: (selectedValues: string[]) => {
            return {
                value: selectedValues.length ? selectedValues : Value.noFilter()
            };
        }
    }
});
