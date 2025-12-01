import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/internal/preview-api';
import { SingleSelectField } from './SingleSelectField';
import {
  SelectListOptionProps,
  SelectListOptionPropsWithCategory,
} from '../shared/SelectFieldContent/SelectFieldOptions/SelectFieldOption/SelectFieldOption';
import { IconBoltFilled } from '@tabler/icons-react';
import { storybookArgTypesIcon } from '../../../../storybook.constants';

const mockOptions: SelectListOptionProps[] = [
  {
    startIcon: <IconBoltFilled />,
    value: 'red',
    label: 'Red',
    rightLabel: 'This is color Red',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'green',
    label: 'Green',
    rightLabel: 'This is color Green',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'blue',
    label: 'Blue',
    rightLabel: 'This is color Blue',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'yellow',
    label: 'Yellow',
    rightLabel: 'This is color Yellow',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'orange',
    label: 'Orange',
    rightLabel: 'This is color Orange',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'purple',
    label: 'Purple',
    rightLabel: 'This is color Purple',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'pink',
    label: 'Pink',
    rightLabel: 'This is color Pink',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'brown',
    label: 'Brown',
    rightLabel: 'This is color Brown',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'gray',
    label: 'Gray',
    rightLabel: 'This is color Gray',
    endIcon: <IconBoltFilled />,
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'black',
    label: 'Black',
    rightLabel: 'This is color Black',
    endIcon: <IconBoltFilled />,
  },
];

const mockOptionsWithCategories: SelectListOptionPropsWithCategory[] = [
  {
    startIcon: <IconBoltFilled />,
    value: 'red',
    label: 'Red',
    rightLabel: 'This is color Red',
    endIcon: <IconBoltFilled />,
    category: 'Warm Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'green',
    label: 'Green',
    rightLabel: 'This is color Green',
    endIcon: <IconBoltFilled />,
    category: 'Cool Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'blue',
    label: 'Blue',
    rightLabel: 'This is color Blue',
    endIcon: <IconBoltFilled />,
    category: 'Cool Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'yellow',
    label: 'Yellow',
    rightLabel: 'This is color Yellow',
    endIcon: <IconBoltFilled />,
    category: 'Warm Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'orange',
    label: 'Orange',
    rightLabel: 'This is color Orange',
    endIcon: <IconBoltFilled />,
    category: 'Warm Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'purple',
    label: 'Purple',
    rightLabel: 'This is color Purple',
    endIcon: <IconBoltFilled />,
    category: 'Cool Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'pink',
    label: 'Pink',
    rightLabel: 'This is color Pink',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'brown',
    label: 'Brown',
    rightLabel: 'This is color Brown',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'gray',
    label: 'Gray',
    rightLabel: 'This is color Gray',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
  {
    startIcon: <IconBoltFilled />,
    value: 'black',
    label: 'Black',
    rightLabel: 'This is color Black',
    endIcon: <IconBoltFilled />,
    category: 'Neutral Colors',
  },
];

const meta = {
  title: 'Editors/SingleSelectField',
  component: SingleSelectField,
  args: {
    label: 'Label',
    required: true,
    value: '',
    disabled: false,
    searchable: false,
    clearable: false,
    options: mockOptions,
    onChange: (value: string) => value,
  },
  argTypes: {
    startIcon: storybookArgTypesIcon,
    // endIcon: storybookArgTypesIcon,
    onChange: { action: 'onChange' },
  },
} satisfies Meta<typeof SingleSelectField>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => {
    const [, updateArgs] = useArgs();

    return (
      <SingleSelectField
        {...args}
        onChange={(val) => {
          updateArgs({ value: val });
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
    value: 'red',
    clearable: true,
  },
};

export const Searchable: Story = {
  args: {
    label: undefined,
    required: false,
    searchable: true,
  },
};

export const WithCategories: Story = {
  args: {
    label: undefined,
    required: false,
    options: mockOptionsWithCategories,
  },
};

export const withError: Story = {
  args: {
    label: undefined,
    required: false,
    error: true,
  },
};

export const withErrorMessage: Story = {
  args: {
    label: undefined,
    required: false,
    errorMessage: 'Value is invalid',
  },
};
