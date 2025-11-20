import type { Meta } from '@storybook/react-webpack5';

import { EditorCard } from './EditorCard';
import { SingleSelectField } from '../../../../../remarkable-ui';

const meta = {
  component: EditorCard,
} satisfies Meta<typeof EditorCard>;

export default meta;

export const Default = () => {
  return (
    <EditorCard title="Editor card title" subtitle="Editor card subtitle">
      <SingleSelectField onChange={console.log} options={[]} />
    </EditorCard>
  );
};

export const Error = () => {
  return (
    <EditorCard
      title="Editor card title"
      subtitle="Editor card subtitle"
      errorMessage="Editor card error message"
    >
      <SingleSelectField onChange={console.log} options={[]} />
    </EditorCard>
  );
};
