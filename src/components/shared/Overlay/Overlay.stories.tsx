import type { Meta } from '@storybook/react-webpack5';
import { Overlay } from './Overlay';
import { Card } from '../Card/Card';

const meta = {
  title: 'Shared/Overlay',
  component: Overlay,
} satisfies Meta<typeof Overlay>;

export default meta;

export const Default = () => {
  return (
    <Overlay>
      <Card style={{ width: '200px', height: '200px' }} />
    </Overlay>
  );
};
