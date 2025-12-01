import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/internal/preview-api';
import { MultiSelectField } from './MultiSelectField';
import {
  SelectListOptionProps,
  SelectListOptionPropsWithCategory,
} from '../shared/SelectFieldContent/SelectFieldOptions/SelectFieldOption/SelectFieldOption';
import { IconBoltFilled } from '@tabler/icons-react';
import { storybookArgTypesIcon } from '../../../../storybook.constants';

const mockOptions: SelectListOptionProps[] = [
  {
    value: 'red',
    label: 'Red',
    rightLabel: 'This is color Red',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'green',
    label: 'Green',
    rightLabel: 'This is color Green',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'blue',
    label: 'Blue',
    rightLabel: 'This is color Blue',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'yellow',
    label: 'Yellow',
    rightLabel: 'This is color Yellow',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'orange',
    label: 'Orange',
    rightLabel: 'This is color Orange',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'purple',
    label: 'Purple',
    rightLabel: 'This is color Purple',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'pink',
    label: 'Pink',
    rightLabel: 'This is color Pink',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'brown',
    label: 'Brown',
    rightLabel: 'This is color Brown',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'gray',
    label: 'Gray',
    rightLabel: 'This is color Gray',
    endIcon: <IconBoltFilled />,
  },
  {
    value: 'black',
    label: 'Black',
    rightLabel: 'This is color Black',
    endIcon: <IconBoltFilled />,
  },
];

const mockOptionsWithCategories: SelectListOptionPropsWithCategory[] = [
  {
    value: 'red',
    label: 'Red',
    rightLabel: 'This is color Red',
    endIcon: <IconBoltFilled />,
    category: 'Warm Colors',
  },
  {
    value: 'green',
    label: 'Green',
    rightLabel: 'This is color Green',
    endIcon: <IconBoltFilled />,
    category: 'Cool Colors',
  },
  {
    value: 'blue',
    label: 'Blue',
    rightLabel: 'This is color Blue',
    endIcon: <IconBoltFilled />,
    category: 'Cool Colors',
  },
  {
    value: 'yellow',
    label: 'Yellow',
    rightLabel: 'This is color Yellow',
    endIcon: <IconBoltFilled />,
    category: 'Warm Colors',
  },
  {
    value: 'orange',
    label: 'Orange',
    rightLabel: 'This is color Orange',
    endIcon: <IconBoltFilled />,
    category: 'Warm Colors',
  },
  {
    value: 'purple',
    label: 'Purple',
    rightLabel: 'This is color Purple',
    endIcon: <IconBoltFilled />,
    category: 'Cool Colors',
  },
  {
    value: 'pink',
    label: 'Pink',
    rightLabel: 'This is color Pink',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
  {
    value: 'brown',
    label: 'Brown',
    rightLabel: 'This is color Brown',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
  {
    value: 'gray',
    label: 'Gray',
    rightLabel: 'This is color Gray',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
  {
    value: 'black',
    label: 'Black',
    rightLabel: 'This is color Black',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
];

const meta = {
  title: 'Editors/MultiSelectField',
  component: MultiSelectField,
  args: {
    label: 'Label',
    required: true,
    values: [],
    disabled: false,
    isSearchable: false,
    isClearable: false,
    options: mockOptions,
    onChange: (value: string[]) => value,
  },
  argTypes: {
    startIcon: storybookArgTypesIcon,
    // endIcon: storybookArgTypesIcon,
    onChange: { action: 'onChange' },
  },
} satisfies Meta<typeof MultiSelectField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    return (
      <MultiSelectField
        {...args}
        onChange={(val) => {
          updateArgs({ values: val });
          args.onChange?.(val);
        }}
      />
    );
  },
};

export const Basic: Story = {
  args: {
    label: undefined,
    required: false,
  },
};

export const WithIcons: Story = {
  args: {
    label: undefined,
    required: false,
    startIcon: IconBoltFilled,
  },
};

export const Disabled: Story = {
  args: {
    label: undefined,
    required: false,
    disabled: true,
  },
};

export const Clearable: Story = {
  args: {
    label: undefined,
    required: false,
    values: ['red'],
    isClearable: true,
  },
};

export const Searchable: Story = {
  args: {
    label: undefined,
    required: false,
    isSearchable: true,
  },
};

export const WithCategories: Story = {
  args: {
    label: undefined,
    required: false,
    options: mockOptionsWithCategories,
  },
};

export const WithError: Story = {
  args: {
    label: undefined,
    required: false,
    error: true,
  },
};

export const WithErrorMessage: Story = {
  args: {
    label: undefined,
    required: false,
    errorMessage: 'Value is invalid',
  },
};
