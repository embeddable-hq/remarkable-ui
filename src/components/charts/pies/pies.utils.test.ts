import { describe, expect, it } from 'vitest';
import { getPieChartData, getPieChartOptions, getDonutChartOptions } from './pies.utils';

describe('getPieChartData', () => {
  it('preserves labels and dataset data', () => {
    const data = {
      labels: ['Red', 'Blue', 'Green'],
      datasets: [{ data: [30, 40, 30] }],
    };

    const result = getPieChartData(data);

    expect(result.labels).toEqual(['Red', 'Blue', 'Green']);
    expect(result.datasets[0]?.data).toEqual([30, 40, 30]);
  });

  it('assigns a color per data point (not per dataset)', () => {
    const data = {
      labels: ['A', 'B', 'C'],
      datasets: [{ data: [10, 20, 30] }],
    };

    const result = getPieChartData(data);

    expect(Array.isArray(result.datasets[0]?.backgroundColor)).toBe(true);
    expect((result.datasets[0]?.backgroundColor as unknown[]).length).toBe(3);
  });

  it('assigns separate colors for each data point', () => {
    const data = {
      labels: ['A', 'B'],
      datasets: [{ data: [10, 20] }],
    };

    const result = getPieChartData(data);
    const colors = result.datasets[0]?.backgroundColor as unknown[];

    expect(colors).toHaveLength(2);
  });

  it('preserves explicit backgroundColor on the dataset', () => {
    const customColors = ['#red', '#blue'];
    const data = {
      labels: ['A', 'B'],
      datasets: [{ data: [10, 20], backgroundColor: customColors as unknown as string }],
    };

    const result = getPieChartData(data);

    expect(result.datasets[0]?.backgroundColor).toEqual(customColors);
  });

  it('handles multiple datasets', () => {
    const data = {
      labels: ['A'],
      datasets: [{ data: [50] }, { data: [50] }],
    };

    const result = getPieChartData(data);

    expect(result.datasets).toHaveLength(2);
  });

  it('returns empty datasets array when no datasets are provided', () => {
    const data = { labels: ['A'], datasets: [] };

    const result = getPieChartData(data);

    expect(result.datasets).toHaveLength(0);
  });
});

describe('getPieChartOptions', () => {
  it('shows the legend when showLegend is true', () => {
    const options = getPieChartOptions({ showLegend: true });

    expect(options.plugins?.legend?.display).toBe(true);
  });

  it('hides the legend when showLegend is false', () => {
    const options = getPieChartOptions({ showLegend: false });

    expect(options.plugins?.legend?.display).toBe(false);
  });

  it('enables tooltips when showTooltips is true', () => {
    const options = getPieChartOptions({ showTooltips: true });

    expect(options.plugins?.tooltip?.enabled).toBe(true);
  });

  it('disables tooltips when showTooltips is false', () => {
    const options = getPieChartOptions({ showTooltips: false });

    expect(options.plugins?.tooltip?.enabled).toBe(false);
  });

  it('shows datalabels when showValueLabels is true', () => {
    const options = getPieChartOptions({ showValueLabels: true });

    expect(options.plugins?.datalabels?.display).toBe('auto');
  });

  it('hides datalabels when showValueLabels is false', () => {
    const options = getPieChartOptions({ showValueLabels: false });

    expect(options.plugins?.datalabels?.display).toBe(false);
  });

  it('sets responsive to true', () => {
    const options = getPieChartOptions({});

    expect(options.responsive).toBe(true);
  });

  it('sets maintainAspectRatio to false', () => {
    const options = getPieChartOptions({});

    expect(options.maintainAspectRatio).toBe(false);
  });
});

describe('getDonutChartOptions', () => {
  it('sets cutout to "60%"', () => {
    const options = getDonutChartOptions({});

    expect(options.cutout).toBe('60%');
  });

  it('inherits showLegend from pie chart options', () => {
    const options = getDonutChartOptions({ showLegend: true });

    expect(options.plugins?.legend?.display).toBe(true);
  });

  it('inherits showTooltips from pie chart options', () => {
    const options = getDonutChartOptions({ showTooltips: false });

    expect(options.plugins?.tooltip?.enabled).toBe(false);
  });

  it('includes an annotation for the inner label when label is provided', () => {
    const options = getDonutChartOptions({ label: '42%' });
    const annotations = options.plugins?.annotation?.annotations as Record<string, unknown>;

    expect(annotations?.innerlabel).toBeDefined();
  });

  it('includes both label and subLabel in the annotation content', () => {
    const options = getDonutChartOptions({ label: '42%', subLabel: 'Revenue' });
    const innerlabel = (
      options.plugins?.annotation?.annotations as Record<string, { content?: unknown }>
    )?.innerlabel;

    expect(innerlabel?.content).toContain('42%');
    expect(innerlabel?.content).toContain('Revenue');
  });

  it('filters out undefined values from annotation content', () => {
    const options = getDonutChartOptions({ label: '42%' });
    const innerlabel = (
      options.plugins?.annotation?.annotations as Record<string, { content?: unknown[] }>
    )?.innerlabel;

    expect(innerlabel?.content).not.toContain(undefined);
  });

  it('sets maintainAspectRatio to false', () => {
    const options = getDonutChartOptions({});

    expect(options.maintainAspectRatio).toBe(false);
  });
});
