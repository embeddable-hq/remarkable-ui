import { Chart, ChartData, ChartOptions, InteractionItem, LegendItem } from 'chart.js';

export const getFunnelChartVisibleData = (
  data: ChartData<'funnel', number[], unknown>,
  hiddenSections: Set<number>,
): ChartData<'funnel', number[], unknown> => {
  const isVisible = (_item: unknown, index: number) => !hiddenSections.has(index);
  return {
    ...data,
    labels: data.labels?.filter(isVisible),
    datasets: data.datasets.map(
      (dataset) =>
        Object.fromEntries(
          Object.entries(dataset).map(([key, value]) => [
            key,
            Array.isArray(value) && value.length === dataset.data.length
              ? value.filter(isVisible)
              : value,
          ]),
        ) as typeof dataset,
    ),
  };
};

const getOriginalFunnelIndex = (visibleIndex: number, hiddenSections: Set<number>) => {
  let index = -1;
  for (let visible = -1; visible < visibleIndex;) {
    index++;
    if (!hiddenSections.has(index)) visible++;
  }
  return index;
};

export const getOriginalFunnelItems = (
  items: InteractionItem[],
  hiddenSections: Set<number>,
): InteractionItem[] =>
  items.map((item) => ({ ...item, index: getOriginalFunnelIndex(item.index, hiddenSections) }));

export const getFunnelLegendLabels =
  (data?: ChartData<'funnel', number[], unknown>, hiddenSections = new Set<number>()) =>
  (chart: Chart<'funnel'>): LegendItem[] => {
    const { labels, datasets } = data ?? chart.data;
    const colors = (datasets[0]?.backgroundColor as string[]) ?? [];
    const labelColor = chart.options.plugins?.legend?.labels?.color as string | undefined;
    return (labels ?? []).map((label, index) => ({
      text: String(label ?? ''),
      fillStyle: colors[index],
      strokeStyle: colors[index],
      fontColor: labelColor,
      hidden: hiddenSections.has(index),
      index,
    }));
  };

export type FunnelLegendState = {
  data: ChartData<'funnel', number[], unknown>;
  hiddenSections: Set<number>;
  onToggleSection: (index: number) => void;
};

export const getFunnelLegendOptions = ({
  data,
  hiddenSections,
  onToggleSection,
}: FunnelLegendState): Partial<ChartOptions<'funnel'>> => ({
  plugins: {
    legend: {
      onClick: (_event, legendItem) => {
        if (legendItem.index !== undefined) onToggleSection(legendItem.index);
      },
      labels: { generateLabels: getFunnelLegendLabels(data, hiddenSections) },
    },
  },
});
