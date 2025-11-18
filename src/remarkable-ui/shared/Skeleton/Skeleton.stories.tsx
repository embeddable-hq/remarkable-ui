import type { Meta } from '@storybook/react-webpack5';

import { Skeleton } from './Skeleton';

const meta = {
  title: 'Shared/✅ Skeleton',
  component: Skeleton,
} satisfies Meta<typeof Skeleton>;

export default meta;

export const Default = () => {
  return (
    <div style={{ width: '200px', height: '100px' }}>
      <Skeleton />
    </div>
  );
};

export const Resize = () => {
  return (
    <div style={{ width: '200px', height: '100px', resize: 'both', overflow: 'auto' }}>
      <Skeleton />
    </div>
  );
};
