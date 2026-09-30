import { describe, expect, it, vi } from 'vitest';
import { Chart, ChartData } from 'chart.js';
import { getFunnelLegendOptions, getFunnelChartVisibleData } from './funnel.stages.utils';

describe('getFunnelChartVisibleData', () => {
  const data: ChartData<'funnel', number[], unknown> = {
    labels: ['A', 'B', 'C'],
    datasets: [{ data: [30, 20, 10], backgroundColor: ['#a', '#b', '#c'] }],
  };

  it('returns the data unchanged when no stages are hidden', () => {
    const result = getFunnelChartVisibleData(data, new Set());

    expect(result).toEqual(data);
  });

  it('drops the hidden stage from labels, data, and backgroundColor', () => {
    const result = getFunnelChartVisibleData(data, new Set([1]));

    expect(result.labels).toEqual(['A', 'C']);
    expect(result.datasets[0]?.data).toEqual([30, 10]);
    expect(result.datasets[0]?.backgroundColor).toEqual(['#a', '#c']);
  });

  it('supports hiding multiple stages', () => {
    const result = getFunnelChartVisibleData(data, new Set([0, 2]));

    expect(result.labels).toEqual(['B']);
    expect(result.datasets[0]?.data).toEqual([20]);
    expect(result.datasets[0]?.backgroundColor).toEqual(['#b']);
  });

  it('drops the hidden stage from per-stage shrinkFraction and shrinkAnchor arrays', () => {
    const dataWithShrink: ChartData<'funnel', number[], unknown> = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [30, 20, 10],
          shrinkFraction: [0.1, 0.2, 0.3],
          shrinkAnchor: ['top', 'middle', 'bottom'],
        },
      ],
    };

    const result = getFunnelChartVisibleData(dataWithShrink, new Set([1]));

    expect(result.datasets[0]?.shrinkFraction).toEqual([0.1, 0.3]);
    expect(result.datasets[0]?.shrinkAnchor).toEqual(['top', 'bottom']);
  });

  it('drops the hidden stage from any per-stage array and leaves other values as they are', () => {
    const dataWithColors: ChartData<'funnel', number[], unknown> = {
      labels: ['A', 'B', 'C'],
      datasets: [
        {
          data: [30, 20, 10],
          borderColor: ['#a', '#b', '#c'],
          hoverBackgroundColor: ['#x', '#y', '#z'],
          borderWidth: 2,
        },
      ],
    };

    const result = getFunnelChartVisibleData(dataWithColors, new Set([1]));

    expect(result.datasets[0]?.borderColor).toEqual(['#a', '#c']);
    expect(result.datasets[0]?.hoverBackgroundColor).toEqual(['#x', '#z']);
    expect(result.datasets[0]?.borderWidth).toBe(2);
  });
});

describe('getFunnelLegendOptions', () => {
  const legendData: ChartData<'funnel', number[], unknown> = {
    labels: ['Near Misses', 'Injury/Illness', 'Recordable'],
    datasets: [{ data: [30, 20, 10], backgroundColor: ['#a', '#b', '#c'] }],
  };

  const buildLegendState = (hiddenStages = new Set<number>(), onToggleStage = vi.fn()) => ({
    data: legendData,
    hiddenStages,
    onToggleStage,
  });

  it('returns one legend item per section with its color, built from the original data', () => {
    const options = getFunnelLegendOptions(buildLegendState());
    const generateLabels = options.plugins?.legend?.labels?.generateLabels as (
      chart: Chart<'funnel'>,
    ) => { text: string; fillStyle: unknown; hidden: boolean; index: number }[];

    const chart = { options: {} } as unknown as Chart<'funnel'>;
    const items = generateLabels(chart);

    expect(items).toEqual([
      expect.objectContaining({ text: 'Near Misses', fillStyle: '#a', hidden: false, index: 0 }),
      expect.objectContaining({
        text: 'Injury/Illness',
        fillStyle: '#b',
        hidden: false,
        index: 1,
      }),
      expect.objectContaining({ text: 'Recordable', fillStyle: '#c', hidden: false, index: 2 }),
    ]);
  });

  it('marks hidden stages as hidden without dropping them from the legend', () => {
    const options = getFunnelLegendOptions(buildLegendState(new Set([1])));
    const generateLabels = options.plugins?.legend?.labels?.generateLabels as (
      chart: Chart<'funnel'>,
    ) => { hidden: boolean; index: number }[];

    const items = generateLabels({ options: {} } as unknown as Chart<'funnel'>);

    expect(items.map((item) => item.hidden)).toEqual([false, true, false]);
  });

  it('calls onToggleStage with the clicked index instead of toggling chart visibility', () => {
    const onToggleStage = vi.fn();
    const options = getFunnelLegendOptions(buildLegendState(new Set(), onToggleStage));

    const onClick = options.plugins?.legend?.onClick as (
      event: unknown,
      legendItem: { index?: number },
      legend: unknown,
    ) => void;
    onClick({}, { index: 1 }, {});

    expect(onToggleStage).toHaveBeenCalledWith(1);
  });
});
