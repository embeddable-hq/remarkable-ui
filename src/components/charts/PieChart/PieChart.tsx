import React, { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  ArcElement,
  Chart as ChartJS,
  ChartData,
  ChartDataset,
  ChartOptions,
  Legend,
  Tooltip,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { mergician } from 'mergician';
import { defaultOptions, defaultData } from './PieChart.utils';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

type PieChartProps = {
  data: ChartData<'pie'>;
  options?: Partial<ChartOptions<'pie'>>;
  onSegmentClick?: (index: number | undefined) => void;
};

export const PieChart: FC<PieChartProps> = ({ data, options = {}, onSegmentClick }) => {
  const chartRef = React.useRef<ChartJSOrUndefined<'pie'>>(null);

  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const defaultDataset = defaultData.datasets?.[index] || { data: [] };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'pie'>;
        return merged;
      }) || [],
  };

  const mergedOptions = mergician(defaultOptions, options);

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const chart = chartRef.current;
    if (!chart) return;

    const points = chart.getElementsAtEventForMode(
      event.nativeEvent,
      'nearest',
      { intersect: true },
      false,
    );

    onSegmentClick?.(points[0]?.index);
  };

  return (
    <Pie ref={chartRef} data={mergedData} options={mergedOptions} onClick={handleSegmentClick} />
  );
};
