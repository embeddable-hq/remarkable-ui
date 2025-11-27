import { FC, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { getDonutChartOptions, getPieChartData } from '../pies.utils';
import { getSegmentIndexClicked } from '../../chartjs.utils';
import { mergician } from 'mergician';
import { BasePieChartProps } from '../pies.types';
import styles from '../../charts.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export type DonutLabelChartProps = BasePieChartProps & { label?: string; subLabel?: string };

export const DonutChart: FC<DonutLabelChartProps> = ({
  label,
  subLabel,
  options = {},
  data,
  onSegmentClick,
  showLegend = true,
  showTooltips = true,
  showValueLabels = true,
}) => {
  const chartRef = useRef(null);

  const donutLabelOptions = mergician(
    getDonutChartOptions({ showLegend, showTooltips, showValueLabels, label, subLabel }),
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
        options={donutLabelOptions}
        onClick={handleSegmentClick}
      />
    </div>
  );
};
