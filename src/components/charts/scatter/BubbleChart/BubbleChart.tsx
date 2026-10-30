import {
  Chart as ChartJS,
  LinearScale,
  LogarithmicScale,
  PointElement,
  BubbleController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { buildChartjsOnClick } from '../../chartjs.utils';
import { useChartFontsReady } from '../../../../hooks/useChartFontsReady.hook';
import styles from '../../charts.module.css';
import { useScatterChartA11y } from '../useScatterChartA11y.hook';

import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { BaseBubbleChartProps } from '../scatter.types';
import { getScatterNullBand, getScatterChartPlugins } from '../scatter.utils';
import { getBubbleChartData, getBubbleChartOptions } from './BubbleChart.utils';

ChartJS.register(
  BubbleController,
  PointElement,
  LinearScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  AnnotationPlugin,
);

export type BubbleChartProps = BaseBubbleChartProps;

export const BubbleChart: FC<BubbleChartProps> = ({
  options = {},
  data,
  onClick,
  nullBandLabel = 'No value',
  ariaLabel,
  ariaDescription,
  ...props
}) => {
  const chartRef = useRef(null);
  useChartFontsReady(chartRef);
  const { canvasProps, description } = useScatterChartA11y({
    type: 'bubble',
    datasets: data.datasets,
    ariaLabel,
    ariaDescription,
    xAxisLabel: props.xAxisLabel,
    yAxisLabel: props.yAxisLabel,
  });

  const propsWithNullBandLabel = { ...props, nullBandLabel };
  const nullBand = getScatterNullBand(data.datasets, props.showLogarithmicScale);
  const chartData = getBubbleChartData(data, { ...propsWithNullBandLabel, nullBand });
  const bubbleOptions = mergician(
    getBubbleChartOptions({ ...propsWithNullBandLabel, nullBand }),
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Bubble
        ref={chartRef}
        data={chartData}
        options={bubbleOptions}
        plugins={getScatterChartPlugins(nullBand)}
        onClick={buildChartjsOnClick(chartRef, onClick)}
        {...canvasProps}
      />
      {description}
    </div>
  );
};
