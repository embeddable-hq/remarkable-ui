import { FC, useRef } from 'react';
import { Chart } from 'react-chartjs-2';
import { buildChartjsOnClick } from '../chartjs.utils';
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { getFunnelChartData, getFunnelChartOptions } from './funnel.utils';
import { useFunnelHiddenSections } from './useFunnelHiddenSections.hook';
import { BaseFunnelChartProps } from './funnel.types';
import styles from '../charts.module.css';
import { mergician } from 'mergician';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  FunnelController,
  TrapezoidElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ChartDataLabels,
);

export type FunnelChartProps = BaseFunnelChartProps;

export const FunnelChart: FC<FunnelChartProps> = ({
  data,
  options = {},
  onClick,
  showLegend = true,
  showTooltips = true,
  showValueLabels = true,
  showPercentage = false,
  percentageDecimalPlaces = 1,
  shrinkAnchor = 'middle',
  shrinkFraction,
}) => {
  const chartRef = useRef(null);
  const funnelData = getFunnelChartData(data);
  const { visibleData, legendOptions, handleClick } = useFunnelHiddenSections(funnelData, onClick);
  const funnelOptions = mergician(
    getFunnelChartOptions({
      showLegend,
      showTooltips,
      showValueLabels,
      showPercentage,
      percentageDecimalPlaces,
      shrinkAnchor,
      shrinkFraction,
    }),
    legendOptions,
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Chart
        ref={chartRef}
        type="funnel"
        data={visibleData}
        options={funnelOptions}
        onClick={buildChartjsOnClick(chartRef, handleClick)}
      />
    </div>
  );
};
