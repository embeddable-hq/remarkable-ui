import {
  Chart,
  ChartData,
  ChartDataset,
  ChartOptions,
  InteractionItem,
  LegendItem,
} from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { mergician } from 'mergician';
import { getChartColors } from '../charts.constants';
import { getChartjsOptions } from '../chartjs.constants';
import { FunnelChartConfigurationProps } from './funnel.types';

export const getFunnelChartData = (data: ChartData<'funnel'>) => {
  const chartColors = getChartColors();
  const mergedData: ChartData<'funnel', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset) => {
        const colors = dataset.data.map((_value, index) => chartColors[index % chartColors.length]);
        const defaultDataset = { backgroundColor: colors };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'funnel'>;
        return merged;
      }) || [],
  };
  return mergedData;
};

const getFunnelDatalabelFormatter =
  (config: FunnelChartConfigurationProps) => (value: number, context: Context) => {
    const data = (context.chart.data.datasets[context.datasetIndex]?.data ?? []) as number[];
    const total = data.reduce((sum, v) => sum + (v || 0), 0);
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return config.showPercentage
      ? `${percentage.toFixed(config.percentageDecimalPlaces ?? 1)}%`
      : value.toLocaleString();
  };

export const getVisibleFunnelData = (
  data: ChartData<'funnel', number[], unknown>,
  hiddenStages: Set<number>,
): ChartData<'funnel', number[], unknown> => {
  if (!hiddenStages.size) return data;
  return {
    ...data,
    labels: (data.labels ?? []).filter((_label, index) => !hiddenStages.has(index)),
    datasets: data.datasets.map((dataset) => ({
      ...dataset,
      data: dataset.data.filter((_value, index) => !hiddenStages.has(index)),
      backgroundColor: Array.isArray(dataset.backgroundColor)
        ? dataset.backgroundColor.filter((_color, index) => !hiddenStages.has(index))
        : dataset.backgroundColor,
      shrinkFraction: Array.isArray(dataset.shrinkFraction)
        ? dataset.shrinkFraction.filter((_value, index) => !hiddenStages.has(index))
        : dataset.shrinkFraction,
      shrinkAnchor: Array.isArray(dataset.shrinkAnchor)
        ? dataset.shrinkAnchor.filter((_value, index) => !hiddenStages.has(index))
        : dataset.shrinkAnchor,
    })),
  };
};

const getOriginalFunnelIndex = (visibleIndex: number, hiddenStages: Set<number>) => {
  let index = -1;
  for (let visible = -1; visible < visibleIndex;) {
    index++;
    if (!hiddenStages.has(index)) visible++;
  }
  return index;
};

export const getOriginalFunnelItems = (
  items: InteractionItem[],
  hiddenStages: Set<number>,
): InteractionItem[] =>
  items.map((item) => ({ ...item, index: getOriginalFunnelIndex(item.index, hiddenStages) }));

const getFunnelLegendLabels =
  (data: ChartData<'funnel', number[], unknown>, hiddenStages: Set<number>) =>
  (chart: Chart<'funnel'>): LegendItem[] => {
    const colors = (data.datasets[0]?.backgroundColor as string[]) ?? [];
    const labelColor = chart.options.plugins?.legend?.labels?.color as string | undefined;
    return (data.labels ?? []).map((label, index) => ({
      text: String(label ?? ''),
      fillStyle: colors[index],
      strokeStyle: colors[index],
      fontColor: labelColor,
      hidden: hiddenStages.has(index),
      index,
    }));
  };

export type FunnelLegendState = {
  data: ChartData<'funnel', number[], unknown>;
  hiddenStages: Set<number>;
  onToggleStage: (index: number) => void;
};

export const getFunnelChartOptions = (
  config: FunnelChartConfigurationProps,
  legendState: FunnelLegendState,
): Partial<ChartOptions<'funnel'>> => {
  const { data, hiddenStages, onToggleStage } = legendState;
  const funnelChartOptions: Partial<ChartOptions<'funnel'>> = {
    indexAxis: 'y',
    elements: {
      trapezoid: {
        ...(config.shrinkAnchor !== undefined && { shrinkAnchor: config.shrinkAnchor }),
        ...(config.shrinkFraction !== undefined && { shrinkFraction: config.shrinkFraction }),
      },
    },
    plugins: {
      legend: {
        display: config.showLegend,
        onClick: (_event, legendItem) => {
          if (legendItem.index !== undefined) onToggleStage(legendItem.index);
        },
        labels: { generateLabels: getFunnelLegendLabels(data, hiddenStages) },
      },
      tooltip: { enabled: config.showTooltips },
      datalabels: {
        display: config.showValueLabels ? 'auto' : false,
        anchor: 'start',
        align: 'center',
        textAlign: 'center',
        formatter: getFunnelDatalabelFormatter(config),
      },
    },
  };

  return mergician(getChartjsOptions(), funnelChartOptions);
};
