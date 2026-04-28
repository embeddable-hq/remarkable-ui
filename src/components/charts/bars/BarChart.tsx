import { FC, useRef } from 'react';
import { Bar, getElementAtEvent, getElementsAtEvent, getDatasetAtEvent } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LogarithmicScale,
} from 'chart.js';
import { BaseBarChartProps } from './bars.types';
import { getBarChartData, getBarChartOptions } from './bars.utils';
import styles from '../charts.module.css';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LogarithmicScale,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export type BarChartProps = BaseBarChartProps;

export const BarChart: FC<BarChartProps> = ({ data, onClick, options = {}, ...props }) => {
  const chartRef = useRef(null);
  const barChartOptions = mergician(getBarChartOptions(props), options);

  return (
    <div className={styles.chartContainer}>
      <Bar
        ref={chartRef}
        data={getBarChartData(data)}
        options={barChartOptions}
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
