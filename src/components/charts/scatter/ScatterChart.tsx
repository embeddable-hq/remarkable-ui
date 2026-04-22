import {
  Chart as ChartJS,
  LinearScale,
  LogarithmicScale,
  PointElement,
  LineElement,
  ScatterController,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import styles from '../charts.module.css';
import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { BaseScatterChartProps } from './scatter.types';
import {
  getScatterChartData,
  getScatterChartOptions,
  getScatterChartPlugins,
} from './scatter.utils';
import { getChartPointClicked } from '../chartjs.cartesian.utils';

ChartJS.register(
  ScatterController,
  LineElement,
  PointElement,
  LinearScale,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  AnnotationPlugin,
);

export type ScatterChartProps = BaseScatterChartProps;

export const ScatterChart: FC<ScatterChartProps> = ({
  options = {},
  data,
  onPointClick,
  nullBandLabel = 'No value',
  ...props
}) => {
  const chartRef = useRef(null);
  const propsWithNullBand = { ...props, nullBandLabel };

  const scatterChartData = getScatterChartData(data, propsWithNullBand);
  const scatterOptions = mergician(
    getScatterChartOptions({ ...propsWithNullBand, nullBand: scatterChartData.nullBand }),
    options,
  );

  const handlePointClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const point = getChartPointClicked(event, chartRef);
    onPointClick?.(point);
  };

  return (
    <div className={styles.chartContainer}>
      <Scatter
        ref={chartRef}
        data={scatterChartData.chartData}
        options={scatterOptions}
        plugins={getScatterChartPlugins(scatterChartData.nullBandPlugin)}
        onClick={handlePointClick}
      />
    </div>
  );
};
