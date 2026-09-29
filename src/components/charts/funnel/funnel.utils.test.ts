import { describe, expect, it, vi } from 'vitest';
import { Chart, ChartData } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { getFunnelChartData, getFunnelChartOptions, getVisibleFunnelData } from './funnel.utils';

describe('getFunnelChartData', () => {
  it('preserves labels and dataset data', () => {
    const data = {
      labels: ['X', 'Y', 'Z'],
      datasets: [{ data: [30, 20, 10] }],
    };

    const result = getFunnelChartData(data);

    expect(result.labels).toEqual(['X', 'Y', 'Z']);
    expect(result.datasets[0]?.data).toEqual([30, 20, 10]);
  });

  it('assigns a color per data point', () => {
    const data = {
      labels: ['A', 'B', 'C'],
      datasets: [{ data: [10, 20, 30] }],
    };

    const result = getFunnelChartData(data);

    expect(result.datasets[0]?.backgroundColor).toHaveLength(3);
  });

  it('preserves explicit backgroundColor on the dataset', () => {
    const customColors = ['#red', '#blue'];
    const data = {
      labels: ['A', 'B'],
      datasets: [{ data: [10, 20], backgroundColor: customColors as unknown as string }],
    };

    const result = getFunnelChartData(data);

    expect(result.datasets[0]?.backgroundColor).toEqual(customColors);
  });

  it('returns an empty datasets array when no datasets are provided', () => {
    const data = { labels: ['A'], datasets: [] };

    const result = getFunnelChartData(data);

    expect(result.datasets).toHaveLength(0);
  });
});

describe('getVisibleFunnelData', () => {
  const data: ChartData<'funnel', number[], unknown> = {
    labels: ['A', 'B', 'C'],
    datasets: [{ data: [30, 20, 10], backgroundColor: ['#a', '#b', '#c'] }],
  };

  it('returns the data unchanged when no stages are hidden', () => {
    const result = getVisibleFunnelData(data, new Set());

    expect(result).toBe(data);
  });

  it('drops the hidden stage from labels, data, and backgroundColor', () => {
    const result = getVisibleFunnelData(data, new Set([1]));

    expect(result.labels).toEqual(['A', 'C']);
    expect(result.datasets[0]?.data).toEqual([30, 10]);
    expect(result.datasets[0]?.backgroundColor).toEqual(['#a', '#c']);
  });

  it('supports hiding multiple stages', () => {
    const result = getVisibleFunnelData(data, new Set([0, 2]));

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

    const result = getVisibleFunnelData(dataWithShrink, new Set([1]));

    expect(result.datasets[0]?.shrinkFraction).toEqual([0.1, 0.3]);
    expect(result.datasets[0]?.shrinkAnchor).toEqual(['top', 'bottom']);
  });
});

describe('getFunnelChartOptions', () => {
  const buildContext = (dataIndex: number, datasetIndex = 0) =>
    ({
      dataIndex,
      datasetIndex,
      chart: {
        data: {
          labels: ['Near Misses', 'Injury/Illness', 'Recordable'],
          datasets: [{ data: [30, 20, 10] }],
        },
      },
    }) as unknown as Context;

  const buildLegendState = (
    data: ChartData<'funnel', number[], unknown> = { labels: [], datasets: [] },
    hiddenStages = new Set<number>(),
    onToggleStage = vi.fn(),
  ) => ({ data, hiddenStages, onToggleStage });

  it('sets the indexAxis to y', () => {
    const options = getFunnelChartOptions({}, buildLegendState());

    expect(options.indexAxis).toBe('y');
  });

  it('shows the legend when showLegend is true', () => {
    const options = getFunnelChartOptions({ showLegend: true }, buildLegendState());

    expect(options.plugins?.legend?.display).toBe(true);
  });

  it('hides the legend when showLegend is false', () => {
    const options = getFunnelChartOptions({ showLegend: false }, buildLegendState());

    expect(options.plugins?.legend?.display).toBe(false);
  });

  it('enables tooltips when showTooltips is true', () => {
    const options = getFunnelChartOptions({ showTooltips: true }, buildLegendState());

    expect(options.plugins?.tooltip?.enabled).toBe(true);
  });

  it('disables tooltips when showTooltips is false', () => {
    const options = getFunnelChartOptions({ showTooltips: false }, buildLegendState());

    expect(options.plugins?.tooltip?.enabled).toBe(false);
  });

  it('shows datalabels when showValueLabels is true', () => {
    const options = getFunnelChartOptions({ showValueLabels: true }, buildLegendState());

    expect(options.plugins?.datalabels?.display).toBe('auto');
  });

  it('hides datalabels when showValueLabels is false', () => {
    const options = getFunnelChartOptions({ showValueLabels: false }, buildLegendState());

    expect(options.plugins?.datalabels?.display).toBe(false);
  });

  describe('shrink options', () => {
    it('omits shrinkAnchor/shrinkFraction when not provided', () => {
      const options = getFunnelChartOptions({}, buildLegendState());

      expect(options.elements?.trapezoid?.shrinkAnchor).toBeUndefined();
      expect(options.elements?.trapezoid?.shrinkFraction).toBeUndefined();
    });

    it('sets shrinkAnchor when provided', () => {
      const options = getFunnelChartOptions({ shrinkAnchor: 'middle' }, buildLegendState());

      expect(options.elements?.trapezoid?.shrinkAnchor).toBe('middle');
    });

    it('sets shrinkFraction when provided', () => {
      const options = getFunnelChartOptions({ shrinkFraction: 0.5 }, buildLegendState());

      expect(options.elements?.trapezoid?.shrinkFraction).toBe(0.5);
    });
  });

  describe('datalabels formatter', () => {
    it('includes the count when showPercentage is false', () => {
      const options = getFunnelChartOptions({ showPercentage: false }, buildLegendState());
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(20, buildContext(1));

      expect(label).toBe('20');
    });

    it('includes the percentage when showPercentage is true', () => {
      const options = getFunnelChartOptions({ showPercentage: true }, buildLegendState());
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(10, buildContext(2));

      expect(label).toBe('16.7%');
    });

    it('formats the percentage using percentageDecimalPlaces', () => {
      const options = getFunnelChartOptions(
        { showPercentage: true, percentageDecimalPlaces: 3 },
        buildLegendState(),
      );
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(10, buildContext(2));

      expect(label).toBe('16.667%');
    });

    it('defaults to 1 decimal place when percentageDecimalPlaces is omitted', () => {
      const options = getFunnelChartOptions({ showPercentage: true }, buildLegendState());
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(10, buildContext(2));

      expect(label).toBe('16.7%');
    });

    it('falls back to a 0% share when the dataset total is 0', () => {
      const options = getFunnelChartOptions({ showPercentage: true }, buildLegendState());
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;
      const context = {
        dataIndex: 0,
        datasetIndex: 0,
        chart: { data: { labels: ['A'], datasets: [{ data: [0] }] } },
      } as unknown as Context;

      const label = formatter(0, context);

      expect(label).toBe('0.0%');
    });
  });

  describe('legend', () => {
    const legendData: ChartData<'funnel', number[], unknown> = {
      labels: ['Near Misses', 'Injury/Illness', 'Recordable'],
      datasets: [{ data: [30, 20, 10], backgroundColor: ['#a', '#b', '#c'] }],
    };

    it('returns one legend item per section with its color, built from the original data', () => {
      const options = getFunnelChartOptions({ showLegend: true }, buildLegendState(legendData));
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
      const options = getFunnelChartOptions(
        { showLegend: true },
        buildLegendState(legendData, new Set([1])),
      );
      const generateLabels = options.plugins?.legend?.labels?.generateLabels as (
        chart: Chart<'funnel'>,
      ) => { hidden: boolean; index: number }[];

      const items = generateLabels({ options: {} } as unknown as Chart<'funnel'>);

      expect(items.map((item) => item.hidden)).toEqual([false, true, false]);
    });

    it('calls onToggleStage with the clicked index instead of toggling chart visibility', () => {
      const onToggleStage = vi.fn();
      const options = getFunnelChartOptions(
        { showLegend: true },
        buildLegendState(legendData, new Set(), onToggleStage),
      );

      const onClick = options.plugins?.legend?.onClick as (
        event: unknown,
        legendItem: { index?: number },
        legend: unknown,
      ) => void;
      onClick({}, { index: 1 }, {});

      expect(onToggleStage).toHaveBeenCalledWith(1);
    });
  });
});
