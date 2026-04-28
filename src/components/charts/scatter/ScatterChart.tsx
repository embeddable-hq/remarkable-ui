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
import { Scatter, getElementAtEvent, getElementsAtEvent, getDatasetAtEvent } from 'react-chartjs-2';
import styles from '../charts.module.css';
import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { BaseScatterChartProps } from './scatter.types';
import {
  getScatterNullBand,
  getScatterChartData,
  getScatterChartOptions,
  getScatterChartPlugins,
} from './scatter.utils';

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
  onClick,
  nullBandLabel = 'No value',
  ...props
}) => {
  const chartRef = useRef(null);

  const propsWithNullBandLabel = { ...props, nullBandLabel };
  const nullBand = getScatterNullBand(data.datasets, props.showLogarithmicScale);
  const chartData = getScatterChartData(data, { ...propsWithNullBandLabel, nullBand });
  const scatterOptions = mergician(
    getScatterChartOptions({ ...propsWithNullBandLabel, nullBand }),
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Scatter
        ref={chartRef}
        data={chartData}
        options={scatterOptions}
        plugins={getScatterChartPlugins(nullBand)}
        onClick={(event) => {
          if (!chartRef.current) return;
          onClick?.({
            event,
            elementAtEvent: getElementAtEvent(chartRef.current, event),
            elementsAtEvent: getElementsAtEvent(chartRef.current, event),
            datasetAtEvent: getDatasetAtEvent(chartRef.current, event),
          });
        }}
      />
    </div>
  );
};
