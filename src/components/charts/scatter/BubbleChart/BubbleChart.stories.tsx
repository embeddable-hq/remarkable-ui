import type { Meta, StoryObj } from '@storybook/react-webpack5';

import { BubbleChart } from './BubbleChart';
import { ChartData } from 'chart.js';
import { BubbleChartInputPoint } from '../scatter.types';
import { decoratorsResizeCard, decoratorsSquare } from '../../../../storybook.constants';

/** Two series (regions), each point is a store/city: x = AOV ($), y = monthly orders (k), size = revenue ($k). */
const data: ChartData<'bubble', BubbleChartInputPoint[]> = {
  datasets: [
    {
      label: 'North America',
      data: [
        { x: 42, y: 18, size: 320, label: 'Toronto' },
        { x: 55, y: 24, size: 580, label: 'Chicago' },
        { x: 38, y: 31, size: 410, label: 'Seattle' },
        { x: 62, y: 14, size: 190, label: 'Miami' },
      ],
    },
    {
      label: 'Europe',
      data: [
        { x: 35, y: 22, size: 270, label: 'Berlin' },
        { x: 48, y: 28, size: 490, label: 'Paris' },
        { x: 44, y: 19, size: 210, label: 'Madrid' },
      ],
    },
  ],
};

const meta = {
  title: 'Charts/BubbleChart',
  component: BubbleChart,
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
    bubbleRadiusMin: 5,
    bubbleRadiusMax: 20,
  },
} satisfies Meta<typeof BubbleChart>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: decoratorsSquare,
};

export const WithRange: Story = {
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
const nullMeasuresData: ChartData<'bubble', BubbleChartInputPoint[]> = {
  datasets: [
    {
      label: 'Series A',
      data: [
        { x: 40, y: 25, size: 400, label: 'Full' },
        { x: null, y: 18, size: 200, label: 'Null X' },
        { x: 52, y: null, size: 300, label: 'Null Y' },
        { x: null, y: null, size: 150, label: 'Both null' },
        { x: 35, y: 30, size: 500, label: 'Full 2' },
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
