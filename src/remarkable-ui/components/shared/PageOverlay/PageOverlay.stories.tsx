import type { Meta } from '@storybook/react-webpack5';
import { PageOverlay } from './PageOverlay';
import { Card } from '../Card/Card';

const meta = {
  title: 'Shared/✅⚠️ PageOverlay',
  component: PageOverlay,
} satisfies Meta<typeof PageOverlay>;

export default meta;

export const Default = () => {
  return (
    <PageOverlay>
      <Card style={{ width: '200px', height: '200px' }} />
    </PageOverlay>
  );
};
