import { FC, useRef, useState } from 'react';
import { Chart } from 'react-chartjs-2';
import { buildChartjsOnClick } from '../chartjs.utils';
import { Chart as ChartJS, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { FunnelController, TrapezoidElement } from 'chartjs-chart-funnel';
import { getFunnelChartData, getFunnelChartOptions } from './funnel.utils';
import {
  getFunnelLegendOptions,
  getOriginalFunnelItems,
  getFunnelChartVisibleData,
} from './funnel.sections.utils';
import { BaseFunnelChartProps } from './funnel.types';
import { ChartClickArgs } from '../charts.types';
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
  const [hiddenLabels, setHiddenLabels] = useState<Set<string>>(new Set());

  const sectionLabels = (data.labels ?? []).map((label) => String(label ?? ''));
  const hiddenSections = new Set(
    sectionLabels.flatMap((label, index) => (hiddenLabels.has(label) ? [index] : [])),
  );

  const handleSectionToggle = (index: number) => {
    const label = sectionLabels[index] ?? '';
    setHiddenLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleClick =
    onClick &&
    ((args: ChartClickArgs) =>
      onClick({
        ...args,
        elementAtEvent: getOriginalFunnelItems(args.elementAtEvent, hiddenSections),
        elementsAtEvent: getOriginalFunnelItems(args.elementsAtEvent, hiddenSections),
        datasetAtEvent: getOriginalFunnelItems(args.datasetAtEvent, hiddenSections),
      }));

  const funnelData = getFunnelChartData(data);
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
    getFunnelLegendOptions({
      data: funnelData,
      hiddenSections,
      onToggleSection: handleSectionToggle,
    }),
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Chart
        ref={chartRef}
        type="funnel"
        data={getFunnelChartVisibleData(funnelData, hiddenSections)}
        options={funnelOptions}
        onClick={buildChartjsOnClick(chartRef, handleClick)}
      />
    </div>
  );
};
