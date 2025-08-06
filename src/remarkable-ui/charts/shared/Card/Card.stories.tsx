import type { Meta } from '@storybook/react-webpack5';
import { Card, CardContent, CardHeader } from './Card';

const meta = {
  component: Card,
} satisfies Meta<typeof Card>;

export default meta;

export const Default = () => (
  <Card>
    <CardHeader title="Title" subtitle="Subtitle" />
    <CardContent>This is the content of the card.</CardContent>
  </Card>
);
