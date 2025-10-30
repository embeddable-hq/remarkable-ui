import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/internal/preview-api';
import { MultiSelectField } from './MultiSelectField';
import { SelectListOptionProps } from '../shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';

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
