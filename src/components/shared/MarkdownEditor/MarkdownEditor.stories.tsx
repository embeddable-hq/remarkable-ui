import type { Meta, StoryObj } from '@storybook/react-webpack5';
import { ComponentProps, useState } from 'react';

import { decoratorsResize } from '../../../storybook.constants';
import { MarkdownEditor } from './MarkdownEditor';

const meta = {
  title: 'shared/MarkdownEditor',
  component: MarkdownEditor,
  args: {
    placeholder: 'Enter markdown...',
  },
} satisfies Meta<typeof MarkdownEditor>;

export default meta;

type Story = StoryObj<typeof meta>;

const ControlledMarkdownEditor = (args: ComponentProps<typeof MarkdownEditor>) => {
  const [value, setValue] = useState('# Hello\n\nThis is **markdown**.');
  return <MarkdownEditor {...args} value={value} onChange={setValue} />;
};

export const Default: Story = {
  render: (args) => <ControlledMarkdownEditor {...args} />,
};

export const Resize: Story = {
  decorators: decoratorsResize,
  render: (args) => <ControlledMarkdownEditor {...args} />,
};
