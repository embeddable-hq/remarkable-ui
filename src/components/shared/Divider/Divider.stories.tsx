import type { Meta } from '@storybook/react-webpack5';
import { Divider } from './Divider';
import { decoratorsSquare } from '../../../storybook.constants';

const meta = {
  title: 'Shared/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;

export const Horizontal = {
  args: {},
  decorators: decoratorsSquare,
};

export const Vertical = {
  args: {
    vertical: true,
  },
  decorators: decoratorsSquare,
};

export const WithThickness = {
  args: {
    thickness: 4,
  },
  decorators: decoratorsSquare,
};

export const WithColor = {
  args: {
    color: 'red',
  },
  decorators: decoratorsSquare,
};
