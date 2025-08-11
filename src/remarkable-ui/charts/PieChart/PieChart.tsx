import React, { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, ChartData, ChartDataset, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { mergician } from 'mergician';
import { defaultData } from '../pies/pies.constants';
import { ChartJSOrUndefined } from 'react-chartjs-2/dist/types';
import { BasePieChartProps } from '../pies/pies.types';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

const getData = (data: ChartData<'pie'>) => {
  const mergedData: ChartData<'pie', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const defaultDataset = defaultData.datasets?.[index] || { data: [] };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'pie'>;
        return merged;
      }) || [],
  };
  return mergedData;
};

export const BasePieChart: FC<BasePieChartProps> = ({ data, options = {}, onSegmentClick }) => {
  const chartRef = React.useRef<ChartJSOrUndefined<'pie'>>(null);

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

  return <Pie ref={chartRef} data={getData(data)} options={options} onClick={handleSegmentClick} />;
};
