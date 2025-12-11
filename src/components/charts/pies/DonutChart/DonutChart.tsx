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
import { useResizeObserver } from '../../../../hooks/useResizeObserver.hook';

const MIN_WIDTH_HEIGHT_TO_SHOW_CHART = 10;

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
  const containerRef = useRef(null);
  const chartRef = useRef(null);

  const donutLabelOptions = mergician(
    getDonutChartOptions({ showLegend, showTooltips, showValueLabels, label, subLabel }),
    options,
  );

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  const { height, width } = useResizeObserver(containerRef, 0);

  const hideChart =
    height < MIN_WIDTH_HEIGHT_TO_SHOW_CHART || width < MIN_WIDTH_HEIGHT_TO_SHOW_CHART;

  return (
    <div className={styles.chartContainer} ref={containerRef}>
      {hideChart ? null : (
        <Pie
          ref={chartRef}
          data={getPieChartData(data)}
          options={donutLabelOptions}
          onClick={handleSegmentClick}
        />
      )}
    </div>
  );
};
