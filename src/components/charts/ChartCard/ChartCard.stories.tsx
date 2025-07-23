import type { Meta } from '@storybook/react-webpack5';
import { ChartCard } from './ChartCard';
import { PieChart } from '../PieChart/PieChart';

const meta = {
  component: ChartCard,
} satisfies Meta<typeof ChartCard>;

export default meta;

export const ChartLoaded = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      isLoading={false}
      hasResults
      style={{ height: '300px' }}
    >
      <PieChart />
    </ChartCard>
  );
};

export const ChartLoadedWithError = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      style={{ height: '300px' }}
      errorMessage="An error occurred while loading the chart."
    >
      <PieChart />
    </ChartCard>
  );
};

export const ChartLoadedWithNoData = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      hasResults={false}
      style={{ height: '300px' }}
    >
      <PieChart />
    </ChartCard>
  );
};

export const ChartLoading = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      isLoading
      hasResults
      style={{ height: '300px' }}
    >
      <PieChart />
    </ChartCard>
  );
};

export const ChartLoadingWithNoData = () => {
  return (
    <ChartCard
      title="Chart Title"
      subtitle="Chart Subtitle"
      hasResults={false}
      isLoading
      style={{ height: '300px' }}
    >
      <PieChart />
    </ChartCard>
  );
};
