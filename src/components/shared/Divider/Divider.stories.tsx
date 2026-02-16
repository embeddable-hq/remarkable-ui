import type { Meta } from '@storybook/react-webpack5';
import { Divider } from './Divider';

const meta = {
  title: 'Shared/Divider',
  component: Divider,
} satisfies Meta<typeof Divider>;

export default meta;

export const Default = {
  args: {},
};

export const WithThickness = {
  args: {
    thickness: 4,
  },
};

export const WithColor = {
  args: {
    color: 'red',
  },
};
