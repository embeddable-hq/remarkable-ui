import { Chart, ChartData, ChartOptions, InteractionItem, LegendItem } from 'chart.js';

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

export const getFunnelLegendLabels =
  (data?: ChartData<'funnel', number[], unknown>, hiddenStages = new Set<number>()) =>
  (chart: Chart<'funnel'>): LegendItem[] => {
    const { labels, datasets } = data ?? chart.data;
    const colors = (datasets[0]?.backgroundColor as string[]) ?? [];
    const labelColor = chart.options.plugins?.legend?.labels?.color as string | undefined;
    return (labels ?? []).map((label, index) => ({
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

export const getFunnelLegendOptions = ({
  data,
  hiddenStages,
  onToggleStage,
}: FunnelLegendState): Partial<ChartOptions<'funnel'>> => ({
  plugins: {
    legend: {
      onClick: (_event, legendItem) => {
        if (legendItem.index !== undefined) onToggleStage(legendItem.index);
      },
      labels: { generateLabels: getFunnelLegendLabels(data, hiddenStages) },
    },
  },
});
