import { FC, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { getPieData } from './pies.utils';
import { getSegmentIndexClicked } from '../chartjs.utils';
import { mergician } from 'mergician';
import { BasePieChartProps } from './pies.types';
import { defaultDonutChartOptions, defaultDonutLabelChartOptions } from './pies.constants';
import styles from '../charts.module.css';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export type DonutLabelChartProps = BasePieChartProps & { label?: string; subLabel?: string };

export const DonutChart: FC<DonutLabelChartProps> = ({
  label,
  subLabel,
  options = {},
  data,
  onSegmentClick,
}) => {
  const chartRef = useRef(null);

  const isDonutLabel = Boolean(label || subLabel);

  const donutLabelOptions = mergician(
    isDonutLabel
      ? {
          plugins: {
            annotation: {
              annotations: {
                innerlabel: {
                  content: [label ?? '', subLabel ?? ''],
                },
              },
            },
          },
        }
      : {},
    isDonutLabel ? defaultDonutLabelChartOptions : defaultDonutChartOptions,
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
        data={getPieData(data)}
        options={donutLabelOptions}
        onClick={handleSegmentClick}
      />
    </div>
  );
};
