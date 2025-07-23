import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { PieChart } from './PieChart';

const meta = {
  component: PieChart,
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
        {
          label: '# of Colors',
          data: [12, 19, 3, 5, 2, 3],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: 'right',
        },
      },
    },
  },
};
