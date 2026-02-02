import type { Meta } from '@storybook/react-webpack5';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Shared/Tooltip',
  component: Tooltip,
} satisfies Meta<typeof Tooltip>;

export default meta;

export const Default = () => {
  return (
    <>
      <Tooltip trigger={<button>Hover me</button>}>This is a tooltip content</Tooltip>
    </>
  );
};
