import type { Meta } from '@storybook/react-webpack5';

import { EmptyStateSkeleton } from './EmptyStateSkeleton';

const meta: Meta<typeof EmptyStateSkeleton> = {
  component: EmptyStateSkeleton,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

export const Default = () => {
  return (
    <div style={{ height: '100vh', width: '100vw', margin: 0, padding: 0 }}>
      <EmptyStateSkeleton />
    </div>
  );
};
