import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/internal/preview-api';
import { MultiSelectField } from './MultiSelectField';
import {
  SelectListOptionProps,
  SelectListOptionPropsWithCategory,
} from '../shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';

const meta = {
  component: MultiSelectField,
} satisfies Meta<typeof MultiSelectField>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockOptions: SelectListOptionProps[] = [
  { value: 'red', label: 'Red' },
  { value: 'green', label: 'Green' },
  { value: 'blue', label: 'Blue' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'orange', label: 'Orange' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' },
  { value: 'brown', label: 'Brown' },
  { value: 'gray', label: 'Gray' },
  { value: 'black', label: 'Black' },
];

export const Empty: Story = {
  args: {
    values: [],
    isSearchable: true,
    options: mockOptions,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Filled: Story = {
  args: {
    values: [mockOptions[0]!.value!],
    options: mockOptions,
    isSearchable: true,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    values: [],
    options: mockOptions,
    onChange: (value) => console.log('onChange', value),
  },
};

export const NoOptions: Story = {
  args: {
    values: [],
    isSearchable: true,
    options: [],
    noOptionsMessage: 'No options available',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithState: Story = {
  render: (args) => {
    const [{ values }, updateArgs] = useArgs();

    return (
      <MultiSelectField
        {...args}
        values={values}
        onChange={(newValues) => updateArgs({ values: newValues })}
      />
    );
  },
  args: {
    values: [],
    isClearable: true,
    isSearchable: true,
    options: mockOptions,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithError: Story = {
  args: {
    values: [],
    error: true,
    errorMessage: 'Please select at least one option',
    isSearchable: true,
    options: mockOptions,
    placeholder: 'Select colors',
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithErrorAndValue: Story = {
  args: {
    values: [mockOptions[0]!.value!],
    error: true,
    errorMessage: 'You must select at least 2 options',
    isSearchable: true,
    isClearable: true,
    options: mockOptions,
    onChange: (value) => console.log('onChange', value),
  },
};

const mockOptionsWithCategories: SelectListOptionPropsWithCategory[] = [
  { value: 'red', label: 'Red', category: 'Primary Colors' },
  { value: 'green', label: 'Green', category: 'Primary Colors' },
  { value: 'blue', label: 'Blue', category: 'Primary Colors' },
  { value: 'yellow', label: 'Yellow', category: 'Secondary Colors' },
  { value: 'orange', label: 'Orange', category: 'Secondary Colors' },
  { value: 'purple', label: 'Purple', category: 'Secondary Colors' },
  { value: 'pink', label: 'Pink', category: 'Tertiary Colors' },
  { value: 'brown', label: 'Brown', category: 'Tertiary Colors' },
  { value: 'gray', label: 'Gray', category: 'Tertiary Colors' },
  { value: 'black', label: 'Black', category: 'Tertiary Colors' },
];

export const WithCategories: Story = {
  args: {
    values: [],
    isSearchable: true,
    isClearable: true,
    options: mockOptionsWithCategories,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithStickyCategories: Story = {
  args: {
    values: [],
    isSearchable: true,
    isClearable: true,
    stickyCategoryLabels: true,
    options: mockOptionsWithCategories,
    onChange: (value) => console.log('onChange', value),
  },
};
