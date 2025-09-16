import type { Meta } from '@storybook/react-webpack5';

import { EmptyStateSkeleton } from './EmptyStateSkeleton';

const meta = {
  component: EmptyStateSkeleton,
} satisfies Meta<typeof EmptyStateSkeleton>;

export default meta;

export const Default = () => {
  return <EmptyStateSkeleton />;
};
