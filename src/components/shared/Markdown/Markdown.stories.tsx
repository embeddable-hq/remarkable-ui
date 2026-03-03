import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { Markdown } from './Markdown';
import { decoratorsResize } from '../../../storybook.constants';

const meta = {
  title: 'shared/Markdown',
  component: Markdown,
  args: {
    content: [
      '# Hello',
      '',
      'This is **markdown** rendered with `react-markdown`.',
      '',
      '- Item 1',
      '- Item 2',
      '- Item 3',
      '',
      '[Link to Embeddable](https://embeddable.com)',
      '',
      '~ignore this line~',
    ].join('\n'),
  },
} satisfies Meta<typeof Markdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Resize: Story = {
  decorators: decoratorsResize,
};
