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
import { FC, useMemo, useRef } from 'react';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { BaseScatterChartProps } from './scatter.types';
import { computeScatterNullBand, createScatterNullBandPlugin } from './scatter.nullBand.utils';
import {
  filterNumericScatterData,
  getScatterChartAxisBorderPatch,
  getScatterChartData,
  getScatterChartOptions,
} from './scatter.utils';
import { getScatterPointClicked } from '../chartjs.utils';

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
  showPointLabels = false,
  showValueLabels = false,
  ...props
}) => {
  const chartRef = useRef(null);
  const nullBandLabel = props.nullBandLabel ?? 'No value';
  const configProps = useMemo(
    () => ({ ...props, showPointLabels, showValueLabels }),
    [props, showPointLabels, showValueLabels],
  );

  const dataForChart = useMemo(() => {
    if (configProps.showLogarithmicScale) return filterNumericScatterData(data);
    return data;
  }, [data, configProps.showLogarithmicScale]);

  const nullBand = useMemo(() => {
    if (configProps.showLogarithmicScale) return null;
    return computeScatterNullBand(dataForChart.datasets);
  }, [dataForChart, configProps.showLogarithmicScale]);

  const chartData = useMemo(
    () =>
      getScatterChartData(dataForChart, {
        nullBand,
        supportsNullMeasures: !configProps.showLogarithmicScale,
      }),
    [dataForChart, nullBand, configProps.showLogarithmicScale],
  );

  const nullBandPlugin = useMemo(() => {
    if (!nullBand || configProps.showLogarithmicScale) return undefined;
    if (!nullBand.hasNullX && !nullBand.hasNullY) return undefined;
    return createScatterNullBandPlugin({ nullBand });
  }, [nullBand, configProps.showLogarithmicScale]);

  const scatterOptions = useMemo(
    () =>
      mergician(
        mergician(getScatterChartOptions(configProps, { nullBand, nullBandLabel }), options),
        getScatterChartAxisBorderPatch(),
      ),
    [configProps, nullBand, nullBandLabel, options],
  );

  const handlePointClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const hit = getScatterPointClicked(event, chartRef);
    onPointClick?.(hit);
  };

  return (
    <div className={styles.chartContainer}>
      <Scatter
        ref={chartRef}
        data={chartData}
        options={scatterOptions}
        plugins={nullBandPlugin ? [nullBandPlugin] : undefined}
        onClick={handlePointClick}
      />
    </div>
  );
};
