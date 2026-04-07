import { describe, expect, it } from 'vitest';
import { getBarChartData, getBarChartOptions } from './bars.utils';

describe('getBarChartData', () => {
  it('preserves labels and dataset data', () => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{ label: 'Revenue', data: [10, 20, 30] }],
    };

    const result = getBarChartData(data);

    expect(result.labels).toEqual(['Jan', 'Feb', 'Mar']);
    expect(result.datasets[0]?.label).toBe('Revenue');
    expect(result.datasets[0]?.data).toEqual([10, 20, 30]);
  });

  it('assigns backgroundColor and borderColor to datasets', () => {
    const data = { labels: [], datasets: [{ data: [1, 2] }] };

    const result = getBarChartData(data);

    expect(result.datasets[0]?.backgroundColor).toBeDefined();
    expect(result.datasets[0]?.borderColor).toBeDefined();
  });

  it('preserves an explicit backgroundColor set on the dataset', () => {
    const data = {
      labels: [],
      datasets: [{ data: [1], backgroundColor: '#custom' as unknown as string }],
    };

    const result = getBarChartData(data);

    expect(result.datasets[0]?.backgroundColor).toBe('#custom');
  });

  it('handles multiple datasets with separate color assignments', () => {
    const data = {
      labels: ['A'],
      datasets: [{ data: [1] }, { data: [2] }],
    };

    const result = getBarChartData(data);

    expect(result.datasets).toHaveLength(2);
  });

  it('returns an empty datasets array when input has no datasets', () => {
    const data = { labels: ['A'], datasets: [] };

    const result = getBarChartData(data);

    expect(result.datasets).toHaveLength(0);
  });
});

describe('getBarChartOptions', () => {
  describe('orientation', () => {
    it('sets indexAxis to "x" for vertical charts (horizontal: false)', () => {
      const options = getBarChartOptions({ horizontal: false });

      expect(options.indexAxis).toBe('x');
    });

    it('sets indexAxis to "y" for horizontal charts', () => {
      const options = getBarChartOptions({ horizontal: true });

      expect(options.indexAxis).toBe('y');
    });
  });

  describe('legend and tooltip', () => {
    it('shows the legend when showLegend is true', () => {
      const options = getBarChartOptions({ showLegend: true });

      expect(options.plugins?.legend?.display).toBe(true);
    });

    it('hides the legend when showLegend is false', () => {
      const options = getBarChartOptions({ showLegend: false });

      expect(options.plugins?.legend?.display).toBe(false);
    });

    it('enables tooltips when showTooltips is true', () => {
      const options = getBarChartOptions({ showTooltips: true });

      expect(options.plugins?.tooltip?.enabled).toBe(true);
    });

    it('disables tooltips when showTooltips is false', () => {
      const options = getBarChartOptions({ showTooltips: false });

      expect(options.plugins?.tooltip?.enabled).toBe(false);
    });
  });

  describe('scale type', () => {
    it('uses logarithmic y scale when showLogarithmicScale is true (vertical)', () => {
      const options = getBarChartOptions({ showLogarithmicScale: true });

      expect(options.scales?.y?.type).toBe('logarithmic');
    });

    it('uses linear y scale by default (vertical)', () => {
      const options = getBarChartOptions({ showLogarithmicScale: false });

      expect(options.scales?.y?.type).toBe('linear');
    });

    it('uses logarithmic x scale when showLogarithmicScale is true (horizontal)', () => {
      const options = getBarChartOptions({ horizontal: true, showLogarithmicScale: true });

      expect(options.scales?.x?.type).toBe('logarithmic');
    });
  });

  describe('stacking', () => {
    it('stacks x and y axes when stacked is true', () => {
      const options = getBarChartOptions({ stacked: true });

      expect(options.scales?.x?.stacked).toBe(true);
      expect(options.scales?.y?.stacked).toBe(true);
    });

    it('does not stack when stacked is false', () => {
      const options = getBarChartOptions({ stacked: false });

      expect(options.scales?.x?.stacked).toBe(false);
      expect(options.scales?.y?.stacked).toBe(false);
    });
  });

  describe('axis range (vertical)', () => {
    it('sets y scale min when yAxisRangeMin is provided', () => {
      const options = getBarChartOptions({ yAxisRangeMin: 10 });

      expect(options.scales?.y?.min).toBe(10);
    });

    it('sets y scale max when yAxisRangeMax is provided', () => {
      const options = getBarChartOptions({ yAxisRangeMax: 200 });

      expect(options.scales?.y?.max).toBe(200);
    });
  });

  describe('axis labels', () => {
    it('displays x axis title when xAxisLabel is provided', () => {
      const options = getBarChartOptions({ xAxisLabel: 'Month' });

      expect(options.scales?.x?.title?.display).toBe(true);
      expect(options.scales?.x?.title?.text).toBe('Month');
    });

    it('hides x axis title when xAxisLabel is not provided', () => {
      const options = getBarChartOptions({});

      expect(options.scales?.x?.title?.display).toBe(false);
    });

    it('displays y axis title when yAxisLabel is provided', () => {
      const options = getBarChartOptions({ yAxisLabel: 'Revenue' });

      expect(options.scales?.y?.title?.display).toBe(true);
      expect(options.scales?.y?.title?.text).toBe('Revenue');
    });
  });

  describe('base options', () => {
    it('sets responsive to true', () => {
      const options = getBarChartOptions({});

      expect(options.responsive).toBe(true);
    });

    it('sets maintainAspectRatio to false', () => {
      const options = getBarChartOptions({});

      expect(options.maintainAspectRatio).toBe(false);
    });
  });

  describe('integer axis tick callback', () => {
    it('sets callback on y scale when all values are integers (vertical)', () => {
      const options = getBarChartOptions({}, { labels: [], datasets: [{ data: [1, 2, 3] }] });

      expect(typeof options.scales?.y?.ticks?.callback).toBe('function');
    });

    it('sets callback on y scale for large integer ranges (vertical)', () => {
      const options = getBarChartOptions({}, { labels: [], datasets: [{ data: [1, 2, 100] }] });

      expect(typeof options.scales?.y?.ticks?.callback).toBe('function');
    });

    it('sets callback to undefined on y scale when values contain decimals (vertical)', () => {
      const options = getBarChartOptions({}, { labels: [], datasets: [{ data: [1.5, 2] }] });

      expect(options.scales?.y?.ticks?.callback).toBeUndefined();
    });

    it('sets callback to undefined on y scale when no data is passed (vertical)', () => {
      const options = getBarChartOptions({});

      expect(options.scales?.y?.ticks?.callback).toBeUndefined();
    });

    it('sets callback on x scale when all values are integers (horizontal)', () => {
      const options = getBarChartOptions(
        { horizontal: true },
        { labels: [], datasets: [{ data: [1, 2, 3] }] },
      );

      expect(typeof options.scales?.x?.ticks?.callback).toBe('function');
    });

    it('sets callback to undefined on x scale when values contain decimals (horizontal)', () => {
      const options = getBarChartOptions(
        { horizontal: true },
        { labels: [], datasets: [{ data: [1.5, 2] }] },
      );

      expect(options.scales?.x?.ticks?.callback).toBeUndefined();
    });
  });
});
