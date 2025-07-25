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
          borderColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
          backgroundColor: ['red', 'blue', 'yellow', 'green', 'purple', 'orange'],
          data: [12000, 19000, 3000, 5000, 2000, 3000],
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          position: 'right',
        },
        tooltip: { enabled: true },
      },
    },
  },
};
