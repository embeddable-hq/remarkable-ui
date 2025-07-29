import type { Meta } from '@storybook/react-webpack5';
import { ChartCard } from './ChartCard';
import { PieChart } from '../PieChart/PieChart';
import { ChartData } from 'chart.js';

const meta = {
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

const data: ChartData<'pie'> = {
  labels: ['Red', 'Blue', 'Yellow'],
  datasets: [
    {
      label: '# of colors',
      data: [300, 50, 100],
      // backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
      // borderColor: ['#FF6384', '#36A2EB', '#FFCE56'],
    },
  ],
};

export const ChartLoaded = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      data={{ data: [{}], isLoading: false }}
      style={{ height: '300px' }}
    >
      <PieChart data={data} options={{}} />
    </ChartCard>
  );
};

export const ChartLoadedWithError = () => {
  return (
    <ChartCard
      data={{ data: [{}], isLoading: false }}
      title="Chart Title"
      subtitle="Chart Subtitle"
      style={{ height: '300px' }}
      errorMessage="An error occurred while loading the chart."
    >
      <PieChart data={data} options={{}} />
    </ChartCard>
  );
};

export const ChartLoadedWithNoData = () => {
  return (
    <ChartCard
      data={{ data: [], isLoading: false }}
      title="Chart Title"
      subtitle="Chart Subtitle"
      style={{ height: '300px' }}
    >
      <PieChart data={data} options={{}} />
    </ChartCard>
  );
};

export const ChartLoading = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      data={{ data: [{}], isLoading: true }}
      style={{ height: '300px' }}
    >
      <PieChart data={data} options={{}} />
    </ChartCard>
  );
};

export const ChartLoadingWithNoData = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      data={{ data: [], isLoading: true }}
      style={{ height: '300px' }}
    >
      <PieChart data={data} options={{}} />
    </ChartCard>
  );
};
