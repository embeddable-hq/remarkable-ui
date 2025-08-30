import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { PieChart } from './PieChart';
import { defaultPieChartOptions } from './pies.constants';
import { pieDataMock } from './pies.mock';

const meta = {
  component: PieChart,
} satisfies Meta<typeof PieChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: pieDataMock,
    options: defaultPieChartOptions,
  },
};

export const Large = () => {
  return (
    <div style={{ width: 400, height: 400 }}>
      <PieChart data={pieDataMock} options={defaultPieChartOptions} />
    </div>
  );
};
