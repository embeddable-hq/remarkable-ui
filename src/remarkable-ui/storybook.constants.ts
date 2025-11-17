import { IconBoltFilled } from '@tabler/icons-react';
import { InputType } from 'storybook/internal/csf';

export const storybookArgTypesIcon: InputType = {
  options: ['IconBoltFilled', '-'],
  mapping: {
    IconBoltFilled,
    '-': undefined,
  },
  control: { type: 'select' },
};
