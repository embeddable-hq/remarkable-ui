import { describe, expect, it } from 'vitest';
import { getLineChartData, getLineChartOptions } from './lines.utils';

describe('getLineChartData', () => {
  it('preserves labels and dataset data', () => {
    const data = {
      labels: ['Jan', 'Feb', 'Mar'],
      datasets: [{ label: 'Sales', data: [10, 20, 30] }],
    };

    const result = getLineChartData(data);

    expect(result.labels).toEqual(['Jan', 'Feb', 'Mar']);
    expect(result.datasets[0]?.label).toBe('Sales');
    expect(result.datasets[0]?.data).toEqual([10, 20, 30]);
  });

  it('assigns backgroundColor and borderColor to datasets', () => {
    const data = { labels: [], datasets: [{ data: [1, 2, 3] }] };

    const result = getLineChartData(data);

    expect(result.datasets[0]?.backgroundColor).toBeDefined();
    expect(result.datasets[0]?.borderColor).toBeDefined();
  });

  it('preserves explicit backgroundColor set on the dataset', () => {
    const data = {
      labels: [],
      datasets: [{ data: [1], backgroundColor: '#custom' as unknown as string }],
    };

    const result = getLineChartData(data);

    expect(result.datasets[0]?.backgroundColor).toBe('#custom');
  });

  it('handles multiple datasets', () => {
    const data = {
      labels: ['A'],
      datasets: [{ data: [1] }, { data: [2] }],
    };

    const result = getLineChartData(data);

    expect(result.datasets).toHaveLength(2);
  });

  it('returns empty datasets array when no datasets are provided', () => {
    const data = { labels: ['A'], datasets: [] };

    const result = getLineChartData(data);

    expect(result.datasets).toHaveLength(0);
  });
});

describe('getLineChartOptions', () => {
  describe('interaction', () => {
    it('sets interaction mode to "x"', () => {
      const options = getLineChartOptions({});

      expect(options.interaction?.mode).toBe('x');
    });

    it('sets interaction intersect to false', () => {
      const options = getLineChartOptions({});

      expect(options.interaction?.intersect).toBe(false);
    });
  });

  describe('legend and tooltip', () => {
    it('shows the legend when showLegend is true', () => {
      const options = getLineChartOptions({ showLegend: true });

      expect(options.plugins?.legend?.display).toBe(true);
    });

    it('hides the legend when showLegend is false', () => {
      const options = getLineChartOptions({ showLegend: false });

      expect(options.plugins?.legend?.display).toBe(false);
    });

    it('enables tooltips when showTooltips is true', () => {
      const options = getLineChartOptions({ showTooltips: true });

      expect(options.plugins?.tooltip?.enabled).toBe(true);
    });

    it('disables tooltips when showTooltips is false', () => {
      const options = getLineChartOptions({ showTooltips: false });

      expect(options.plugins?.tooltip?.enabled).toBe(false);
    });
  });

  describe('scale type', () => {
    it('uses logarithmic y scale when showLogarithmicScale is true', () => {
      const options = getLineChartOptions({ showLogarithmicScale: true });

      expect(options.scales?.y?.type).toBe('logarithmic');
    });

    it('uses linear y scale by default', () => {
      const options = getLineChartOptions({ showLogarithmicScale: false });

      expect(options.scales?.y?.type).toBe('linear');
    });
  });

  describe('axis range', () => {
    it('sets y scale min when yAxisRangeMin is provided', () => {
      const options = getLineChartOptions({ yAxisRangeMin: 5 });

      expect(options.scales?.y?.min).toBe(5);
    });

    it('sets y scale max when yAxisRangeMax is provided', () => {
      const options = getLineChartOptions({ yAxisRangeMax: 500 });

      expect(options.scales?.y?.max).toBe(500);
    });
  });

  describe('axis labels', () => {
    it('displays x axis title when xAxisLabel is provided', () => {
      const options = getLineChartOptions({ xAxisLabel: 'Month' });

      expect(options.scales?.x?.title?.display).toBe(true);
      expect(options.scales?.x?.title?.text).toBe('Month');
    });

    it('hides x axis title when xAxisLabel is not provided', () => {
      const options = getLineChartOptions({});

      expect(options.scales?.x?.title?.display).toBe(false);
    });

    it('displays y axis title when yAxisLabel is provided', () => {
      const options = getLineChartOptions({ yAxisLabel: 'Units' });

      expect(options.scales?.y?.title?.display).toBe(true);
      expect(options.scales?.y?.title?.text).toBe('Units');
    });
  });

  describe('x axis reverse', () => {
    it('reverses the x axis when reverseXAxis is true', () => {
      const options = getLineChartOptions({ reverseXAxis: true });

      expect(options.scales?.x?.reverse).toBe(true);
    });

    it('does not reverse x axis when reverseXAxis is false', () => {
      const options = getLineChartOptions({ reverseXAxis: false });

      expect(options.scales?.x?.reverse).toBe(false);
    });
  });

  describe('base options', () => {
    it('sets responsive to true', () => {
      const options = getLineChartOptions({});

      expect(options.responsive).toBe(true);
    });

    it('sets maintainAspectRatio to false', () => {
      const options = getLineChartOptions({});

      expect(options.maintainAspectRatio).toBe(false);
    });
  });

  describe('integer axis tick callback', () => {
    it('sets callback on y scale when all values are integers', () => {
      const options = getLineChartOptions({}, { labels: [], datasets: [{ data: [1, 2, 3] }] });

      expect(typeof options.scales?.y?.ticks?.callback).toBe('function');
    });

    it('sets callback on y scale for large integer ranges', () => {
      const options = getLineChartOptions({}, { labels: [], datasets: [{ data: [10, 20] }] });

      expect(typeof options.scales?.y?.ticks?.callback).toBe('function');
    });

    it('sets callback to undefined when values contain decimals', () => {
      const options = getLineChartOptions({}, { labels: [], datasets: [{ data: [1.1, 2] }] });

      expect(options.scales?.y?.ticks?.callback).toBeUndefined();
    });

    it('sets callback to undefined when no data is passed', () => {
      const options = getLineChartOptions({});

      expect(options.scales?.y?.ticks?.callback).toBeUndefined();
    });
  });
});
