import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/internal/preview-api';
import { SingleSelectField } from './SingleSelectField';
import { SelectListOptionProps } from '../shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';

const meta = {
  component: SingleSelectField,
} satisfies Meta<typeof SingleSelectField>;

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
    value: '',
    isSearchable: true,
    options: mockOptions,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Filled: Story = {
  args: {
    value: mockOptions[0]!.value,
    options: mockOptions,
    isSearchable: true,
    onChange: (value) => console.log('onChange', value),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: '',
    options: mockOptions,
    onChange: (value) => console.log('onChange', value),
  },
};

export const WithState: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();

    return (
      <SingleSelectField
        {...args}
        value={value}
        onChange={(newValue) => updateArgs({ value: newValue })}
      />
    );
  },
  args: {
    value: '',
    isClearable: true,
    isSearchable: true,
    options: mockOptions,
    onChange: (value) => console.log('onChange', value),
  },
};
