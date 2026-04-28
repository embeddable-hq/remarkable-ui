import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
  Filler,
} from 'chart.js';
import { Line, getElementAtEvent, getElementsAtEvent, getDatasetAtEvent } from 'react-chartjs-2';
import styles from '../charts.module.css';
import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import { BaseLineChartProps } from './lines.types';
import { getLineChartData, getLineChartOptions } from './lines.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  LogarithmicScale,
  Filler,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
  AnnotationPlugin,
);

export type LineChartProps = BaseLineChartProps;

export const LineChart: FC<LineChartProps> = ({ options = {}, data, onClick, ...props }) => {
  const chartRef = useRef(null);

  const lineOptions = mergician(getLineChartOptions(props), options);

  return (
    <div className={styles.chartContainer}>
      <Line
        ref={chartRef}
        data={getLineChartData(data)}
        options={lineOptions}
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
