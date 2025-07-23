import type { Meta } from '@storybook/react-webpack5';

import { ChartCardContent } from './ChartCardContent';
import { Card, CardHeader } from 'src/components/shared/Card/Card';

const meta = {
  component: ChartCardContent,
} satisfies Meta<typeof ChartCardContent>;

export default meta;

export const ChartLoadingWithNoData = () => {
  return (
    <div>
      <Card isLoading style={{ height: '200px' }}>
        <CardHeader title="Chart Title" subtitle="Chart Subtitle" />
        <ChartCardContent hasResults={false} isLoading>
          PieChart
        </ChartCardContent>
      </Card>
    </div>
  );
};

export const ChartLoadingWithData = () => {
  return (
    <div>
      <Card isLoading style={{ height: '200px' }}>
        <CardHeader title="Chart Title" subtitle="Chart Subtitle" />
        <ChartCardContent hasResults isLoading={true}>
          PieChart
        </ChartCardContent>
      </Card>
    </div>
  );
};

export const ChartWithError = () => {
  return (
    <div>
      <Card style={{ height: '200px' }}>
        <CardHeader title="Chart Title" subtitle="Chart Subtitle" />
        <ChartCardContent hasResults isLoading={false} errorMessage="Failed to load chart data.">
          PieChart
        </ChartCardContent>
      </Card>
    </div>
  );
};

export const ChartWithNoData = () => {
  return (
    <div>
      <Card style={{ height: '200px' }}>
        <CardHeader title="Chart Title" subtitle="Chart Subtitle" />
        <ChartCardContent hasResults={false} isLoading={false}>
          PieChart
        </ChartCardContent>
      </Card>
    </div>
  );
};
