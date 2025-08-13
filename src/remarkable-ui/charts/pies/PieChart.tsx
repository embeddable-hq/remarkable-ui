import { FC, useRef } from 'react';
import { BasePieChartProps } from './pies.types';
import { mergician } from 'mergician';
import { defaultPieChartOptions } from './pies.constants';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { getPieData, getPieSegmentIndexClicked } from './pies.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export type PieChartProps = BasePieChartProps;

export const PieChart: FC<PieChartProps> = ({ data, options = {}, onSegmentClick }) => {
  const chartRef = useRef(null);

  const pieOptions = mergician(defaultPieChartOptions, options);

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getPieSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <Pie ref={chartRef} data={getPieData(data)} options={pieOptions} onClick={handleSegmentClick} />
  );
};
