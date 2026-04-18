import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { ScatterChart } from './ScatterChart';
import { ChartData } from 'chart.js';
import { ScatterChartInputPoint } from './scatter.types';
import { decoratorsResizeCard, decoratorsSquare } from '../../../storybook.constants';

/** Two series (regions), each point is a store/city with x = AOV ($), y = monthly orders (k). */
const data: ChartData<'scatter', ScatterChartInputPoint[]> = {
  datasets: [
    {
      label: 'North America',
      data: [
        { x: 42, y: 18, label: 'Toronto' },
        { x: 55, y: 24, label: 'Chicago' },
        { x: 38, y: 31, label: 'Seattle' },
        { x: 62, y: 14, label: 'Miami' },
      ],
    },
    {
      label: 'Europe',
      data: [
        { x: 35, y: 22, label: 'Berlin' },
        { x: 48, y: 28, label: 'Paris' },
        { x: 44, y: 19, label: 'Madrid' },
      ],
    },
  ],
};

const meta = {
  title: 'Charts/ScatterChart',
  component: ScatterChart,
  args: {
    data,
    showValueLabels: false,
    showPointLabels: false,
    showLegend: true,
    showTooltips: true,
    xAxisLabel: 'Average order value ($)',
    yAxisLabel: 'Orders (thousands)',
    reverseXAxis: false,
    showLogarithmicScale: false,
  },
} satisfies Meta<typeof ScatterChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: decoratorsSquare,
};

export const WidthRange: Story = {
  args: {
    xAxisRangeMin: 30,
    xAxisRangeMax: 70,
    yAxisRangeMin: 10,
    yAxisRangeMax: 35,
    showValueLabels: true,
    showPointLabels: true,
  },
  decorators: decoratorsSquare,
};

export const Resize: Story = {
  decorators: decoratorsResizeCard,
};

/** Mixed null x and/or y with numeric points: null bands, axis label, and reduced opacity on null measures. */
const nullMeasuresData: ChartData<'scatter', ScatterChartInputPoint[]> = {
  datasets: [
    {
      label: 'Series A',
      data: [
        { x: 40, y: 25, label: 'Full' },
        { x: null, y: 18, label: 'Null X' },
        { x: 52, y: null, label: 'Null Y' },
        { x: null, y: null, label: 'Both null' },
        { x: 35, y: 30, label: 'Full 2' },
      ],
    },
  ],
};

export const NullMeasures: Story = {
  args: {
    data: nullMeasuresData,
    showLegend: true,
    xAxisLabel: 'Measure A',
    yAxisLabel: 'Measure B',
    nullBandLabel: 'No value',
  },
  decorators: decoratorsSquare,
};
