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
import { buildChartjsOnClick } from '../../chartjs.utils';
import { useChartFontsReady } from '../../../../hooks/useChartFontsReady.hook';
import styles from '../../charts.module.css';
import { describeScatterChart } from '../../chartjs.a11y.utils';
import { useChartA11y } from '../../useChartA11y.hook';

import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { BaseScatterChartProps } from '../scatter.types';
import {
  getScatterNullBand,
  getScatterChartOptions,
  getScatterChartPlugins,
} from '../scatter.utils';
import { getScatterChartData } from './ScatterChart.utils';

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
  ariaLabel,
  ariaDescription,
  ...props
}) => {
  const chartRef = useRef(null);
  useChartFontsReady(chartRef);
  const { canvasProps, description } = useChartA11y({
    ariaLabel,
    ariaDescription,
    defaultLabel: 'Scatter chart',
    getSummary: () =>
      describeScatterChart({
        type: 'scatter',
        datasets: data.datasets,
        xAxisLabel: props.xAxisLabel,
        yAxisLabel: props.yAxisLabel,
      }),
    summaryDeps: [data, props.xAxisLabel, props.yAxisLabel],
  });

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
        onClick={buildChartjsOnClick(chartRef, onClick)}
        {...canvasProps}
      />
      {description}
    </div>
  );
};
