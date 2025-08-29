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
  { value: 'red', label: 'Red', rightLabel: 'This is color Red' },
  { value: 'green', label: 'Green', rightLabel: 'This is color Green' },
  { value: 'blue', label: 'Blue', rightLabel: 'This is color Blue' },
  { value: 'yellow', label: 'Yellow', rightLabel: 'This is color Yellow' },
  { value: 'orange', label: 'Orange', rightLabel: 'This is color Orange' },
  { value: 'purple', label: 'Purple', rightLabel: 'This is color Purple' },
  { value: 'pink', label: 'Pink', rightLabel: 'This is color Pink' },
  { value: 'brown', label: 'Brown', rightLabel: 'This is color Brown' },
  { value: 'gray', label: 'Gray', rightLabel: 'This is color Gray' },
  { value: 'black', label: 'Black', rightLabel: 'This is color Black' },
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

export const Small = () => (
  <div style={{ width: 200 }}>
    <SingleSelectField
      autoWidth
      value={mockOptions[0]!.value}
      options={mockOptions}
      isSearchable
      onChange={(value) => console.log('onChange', value)}
    />
  </div>
);

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
