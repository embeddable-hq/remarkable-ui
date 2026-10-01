import { describe, expect, it } from 'vitest';
import { Chart } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { getFunnelChartData, getFunnelChartOptions } from './funnel.utils';

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

  it('sets the indexAxis to y', () => {
    const options = getFunnelChartOptions({});

    expect(options.indexAxis).toBe('y');
  });

  it('builds one legend item per section from the chart data', () => {
    const options = getFunnelChartOptions({});
    const generateLabels = options.plugins?.legend?.labels?.generateLabels as (
      chart: Chart<'funnel'>,
    ) => { text: string; fillStyle: unknown; hidden: boolean }[];

    const chart = {
      data: { labels: ['A', 'B'], datasets: [{ data: [20, 10], backgroundColor: ['#a', '#b'] }] },
      options: {},
    } as unknown as Chart<'funnel'>;

    expect(generateLabels(chart)).toEqual([
      expect.objectContaining({ text: 'A', fillStyle: '#a', hidden: false }),
      expect.objectContaining({ text: 'B', fillStyle: '#b', hidden: false }),
    ]);
  });

  it('shows the legend when showLegend is true', () => {
    const options = getFunnelChartOptions({ showLegend: true });

    expect(options.plugins?.legend?.display).toBe(true);
  });

  it('hides the legend when showLegend is false', () => {
    const options = getFunnelChartOptions({ showLegend: false });

    expect(options.plugins?.legend?.display).toBe(false);
  });

  it('enables tooltips when showTooltips is true', () => {
    const options = getFunnelChartOptions({ showTooltips: true });

    expect(options.plugins?.tooltip?.enabled).toBe(true);
  });

  it('disables tooltips when showTooltips is false', () => {
    const options = getFunnelChartOptions({ showTooltips: false });

    expect(options.plugins?.tooltip?.enabled).toBe(false);
  });

  it('shows datalabels when showValueLabels is true', () => {
    const options = getFunnelChartOptions({ showValueLabels: true });

    expect(options.plugins?.datalabels?.display).toBe('auto');
  });

  it('hides datalabels when showValueLabels is false', () => {
    const options = getFunnelChartOptions({ showValueLabels: false });

    expect(options.plugins?.datalabels?.display).toBe(false);
  });

  describe('shrink options', () => {
    it('omits shrinkAnchor/shrinkFraction when not provided', () => {
      const options = getFunnelChartOptions({});

      expect(options.elements?.trapezoid?.shrinkAnchor).toBeUndefined();
      expect(options.elements?.trapezoid?.shrinkFraction).toBeUndefined();
    });

    it('sets shrinkAnchor when provided', () => {
      const options = getFunnelChartOptions({ shrinkAnchor: 'middle' });

      expect(options.elements?.trapezoid?.shrinkAnchor).toBe('middle');
    });

    it('sets shrinkFraction when provided', () => {
      const options = getFunnelChartOptions({ shrinkFraction: 0.5 });

      expect(options.elements?.trapezoid?.shrinkFraction).toBe(0.5);
    });
  });

  describe('datalabels formatter', () => {
    it('includes the count when showPercentage is false', () => {
      const options = getFunnelChartOptions({ showPercentage: false });
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(20, buildContext(1));

      expect(label).toBe('20');
    });

    it('includes the percentage when showPercentage is true', () => {
      const options = getFunnelChartOptions({ showPercentage: true });
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(10, buildContext(2));

      expect(label).toBe('16.7%');
    });

    it('formats the percentage using percentageDecimalPlaces', () => {
      const options = getFunnelChartOptions({ showPercentage: true, percentageDecimalPlaces: 3 });
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(10, buildContext(2));

      expect(label).toBe('16.667%');
    });

    it('defaults to 1 decimal place when percentageDecimalPlaces is omitted', () => {
      const options = getFunnelChartOptions({ showPercentage: true });
      const formatter = options.plugins?.datalabels?.formatter as (
        value: number,
        context: Context,
      ) => string;

      const label = formatter(10, buildContext(2));

      expect(label).toBe('16.7%');
    });

    it('falls back to a 0% share when the dataset total is 0', () => {
      const options = getFunnelChartOptions({ showPercentage: true });
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
});
