import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { useArgs } from 'storybook/preview-api';

import { MarkdownEditor } from './MarkdownEditor';

const meta = {
  title: 'shared/MarkdownEditor',
  component: MarkdownEditor,
  args: {
    placeholder: 'Enter markdown...',
    value: '# Hello\n\nThis is **markdown**.',
  },
} satisfies Meta<typeof MarkdownEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => {
    const [{ value }, updateArgs] = useArgs();
    return <MarkdownEditor {...args} value={value} onChange={(v) => updateArgs({ value: v })} />;
  },
};
