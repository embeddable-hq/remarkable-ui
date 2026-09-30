import { FC, useEffect, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { buildChartjsOnClick } from '../chartjs.utils';
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { getFunnelChartData, getFunnelChartOptions, getVisibleFunnelData } from './funnel.utils';
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
  const [hiddenStages, setHiddenStages] = useState<Set<number>>(new Set());

  useEffect(() => {
    setHiddenStages(new Set());
  }, [data]);

  const toggleStage = (index: number) => {
    setHiddenStages((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const funnelData = getFunnelChartData(data);
  const funnelOptions = mergician(
    getFunnelChartOptions(
      {
        showLegend,
        showTooltips,
        showValueLabels,
        showPercentage,
        percentageDecimalPlaces,
        shrinkAnchor,
        shrinkFraction,
      },
      { data: funnelData, hiddenStages, onToggleStage: toggleStage },
    ),
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Chart
        ref={chartRef}
        type="funnel"
        data={getVisibleFunnelData(funnelData, hiddenStages)}
        options={funnelOptions}
        onClick={buildChartjsOnClick(chartRef, onClick)}
      />
    </div>
  );
};
