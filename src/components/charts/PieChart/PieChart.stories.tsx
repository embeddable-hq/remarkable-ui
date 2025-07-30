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
      labels: ['Orange 1', 'Orange 2', 'Orange 3', 'Orange 4', 'Orange 5', 'Orange 6'],
      datasets: [
        {
          data: [12, 19, 3, 5, 2, 3],
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          display: true,
        },
        legend: {
          position: 'right',
          display: true,
        },
        tooltip: { enabled: true },
      },
    },
  },
};
