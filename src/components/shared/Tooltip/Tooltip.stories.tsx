import type { Meta } from '@storybook/react-webpack5';
import { Tooltip } from './Tooltip';
import { Button } from '../Button/Button';

const meta = {
  title: 'Shared/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;

export const Default = {
  args: {
    trigger: <Button>Hover me</Button>,
    children: 'This is a tooltip content',
  },
};

export const LongTooltip = {
  args: {
    trigger: <Button>Hover me</Button>,
    children:
      'This is a tooltip content with a bit longer text to demonstrate how it looks like when there is more content inside the tooltip.',
  },
};
