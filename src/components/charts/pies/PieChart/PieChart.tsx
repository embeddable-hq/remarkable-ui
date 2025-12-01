import { FC, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { getPieChartData, getPieChartOptions } from '../pies.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getSegmentIndexClicked } from '../../chartjs.utils';
import { mergician } from 'mergician';
import { BasePieChartProps } from '../pies.types';
import styles from '../../charts.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

export type PieChartProps = BasePieChartProps;

export const PieChart: FC<PieChartProps> = ({
  data,
  options = {},
  onSegmentClick,
  showLegend = true,
  showTooltips = true,
  showValueLabels = true,
}) => {
  const chartRef = useRef(null);

  const pieOptions = mergician(
    getPieChartOptions({
      showLegend,
      showTooltips,
      showValueLabels,
    }),
    options,
  );

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <div className={styles.chartContainer}>
      <Pie
        ref={chartRef}
        data={getPieChartData(data)}
        options={pieOptions}
        onClick={handleSegmentClick}
      />
    </div>
  );
};
