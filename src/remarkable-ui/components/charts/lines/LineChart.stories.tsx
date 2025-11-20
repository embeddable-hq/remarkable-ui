import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { LineChart } from './LineChart';

const meta = {
  component: LineChart,
} satisfies Meta<typeof LineChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        {
          label: 'Primary Dataset',
          data: [10, 20, 5, 80, 10],
          xAxisID: 'x',
        },
        {
          label: 'Secondary Dataset',
          data: [20, 60, 30, 50, 80],
          xAxisID: 'x',
        },
      ],
    },
    showValueLabels: true,
    showLegend: true,
    showTooltips: true,
  },
};

//  x1: {
//         title: {
//           display: true,
//           text: 'X1 Axis',
//           color: 'red',
//         },
//         labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'], // <-- DIFFERENT VALUES
//         position: 'bottom',
//       },
