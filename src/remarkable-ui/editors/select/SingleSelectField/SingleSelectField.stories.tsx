import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/internal/preview-api';
import { SingleSelectField } from './SingleSelectField';
import { SelectListOptionProps } from '../shared/SelectList/SelectListOptions/SelectListOption/SelectListOption';

const meta = {
  component: SingleSelectField,
} satisfies Meta<typeof SingleSelectField>;

export default meta;

type Story = StoryObj<typeof meta>;

const mockLongOptions: SelectListOptionProps[] = [
  {
    value: 'red',
    label:
      'Red - The color of passion and energy, often associated with excitement, love, and intensity.',
  },
  {
    value: 'green',
    label: 'Green - The color of nature and growth, symbolizing renewal, harmony, and freshness.',
  },
  { value: 'yellow', label: 'Yellow - The color of sunshine, happiness, and optimism.' },
  {
    value: 'orange',
    label: 'Orange - A vibrant color representing enthusiasm, creativity, and encouragement.',
  },
  { value: 'purple', label: 'Purple - Associated with royalty, luxury, and ambition.' },
  { value: 'pink', label: 'Pink - The color of compassion, nurturing, and love.' },
  { value: 'brown', label: 'Brown - The color of stability, reliability, and comfort.' },
  { value: 'gray', label: 'Gray - A neutral color representing balance and calm.' },
  { value: 'black', label: 'Black - The color of elegance, mystery, and sophistication.' },
];

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

const mockOptionsWithRightLabel: SelectListOptionProps[] = [
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

export const SmallButtonLongText = () => (
  <div style={{ width: 200 }}>
    <SingleSelectField
      isClearable
      value={mockLongOptions[0]!.value}
      options={mockLongOptions}
      isSearchable
      onChange={(value) => console.log('onChange', value)}
    />
  </div>
);

export const SmallButtonSmallText = () => (
  <div style={{ width: 200 }}>
    <SingleSelectField
      isClearable
      value={mockOptions[0]!.value}
      options={mockOptions}
      isSearchable
      onChange={(value) => console.log('onChange', value)}
    />
  </div>
);

export const SmallButtonRightSideLabel = () => (
  <div style={{ width: 200 }}>
    <SingleSelectField
      isClearable
      value={mockOptionsWithRightLabel[0]!.value}
      options={mockOptionsWithRightLabel}
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
