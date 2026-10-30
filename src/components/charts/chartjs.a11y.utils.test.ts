import { describe, expect, it } from 'vitest';
import {
  describeCartesianChart,
  describeFunnelChart,
  describePieChart,
  describeScatterChart,
} from './chartjs.a11y.utils';

describe('describeCartesianChart', () => {
  it('summarises a single series with highest and lowest', () => {
    expect(
      describeCartesianChart({
        type: 'bar',
        data: {
          labels: ['Jan', 'Feb', 'Mar'],
          datasets: [{ label: 'Revenue', data: [10, 30, 5] }],
        },
        xAxisLabel: 'Month',
        yAxisLabel: 'Revenue',
      }),
    ).toBe(
      'Bar chart with 3 categories. X axis: Month. Y axis: Revenue. Revenue: highest Feb (30), lowest Mar (5).',
    );
  });

  it('adds start and end values for line charts', () => {
    expect(
      describeCartesianChart({
        type: 'line',
        data: { labels: ['Jan', 'Feb', 'Mar'], datasets: [{ label: 'Sales', data: [10, 30, 5] }] },
      }),
    ).toContain('Sales: starts at 10, ends at 5.');
  });

  it('mentions the number of series and names unlabelled ones', () => {
    const summary = describeCartesianChart({
      type: 'bar',
      data: { labels: ['A', 'B'], datasets: [{ data: [1, 2] }, { data: [3, 4] }] },
    });

    expect(summary).toContain('2 categories and 2 series');
    expect(summary).toContain('Series 1: highest B (2), lowest A (1).');
    expect(summary).toContain('Series 2: highest B (4), lowest A (3).');
  });

  it('caps the number of described series', () => {
    const datasets = Array.from({ length: 7 }, (_, i) => ({ label: `S${i}`, data: [1, 2] }));

    expect(
      describeCartesianChart({ type: 'bar', data: { labels: ['A', 'B'], datasets } }),
    ).toContain('2 more series not described.');
  });

  it('describes a single value without highest/lowest', () => {
    expect(
      describeCartesianChart({
        type: 'bar',
        data: { labels: ['A'], datasets: [{ label: 'X', data: [4] }] },
      }),
    ).toContain('X: A (4).');
  });

  it('ignores null values', () => {
    expect(
      describeCartesianChart({
        type: 'bar',
        data: { labels: ['A', 'B', 'C'], datasets: [{ label: 'X', data: [null, 2, 1] }] },
      }),
    ).toContain('X: highest B (2), lowest C (1).');
  });

  it('handles empty data', () => {
    expect(describeCartesianChart({ type: 'line', data: { labels: [], datasets: [] } })).toBe(
      'Line chart with no data.',
    );
  });
});

describe('describePieChart', () => {
  it('summarises slices with percentages', () => {
    expect(
      describePieChart({
        type: 'pie',
        data: { labels: ['A', 'B', 'C'], datasets: [{ data: [50, 30, 20] }] },
      }),
    ).toBe('Pie chart with 3 slices totalling 100. Largest: A (50, 50%). Smallest: C (20, 20%).');
  });

  it('labels donuts and handles a single slice', () => {
    expect(
      describePieChart({ type: 'donut', data: { labels: ['A'], datasets: [{ data: [5] }] } }),
    ).toBe('Donut chart with 1 slice totalling 5. Largest: A (5, 100%).');
  });

  it('handles empty data', () => {
    expect(describePieChart({ type: 'pie', data: { labels: [], datasets: [{ data: [] }] } })).toBe(
      'Pie chart with no data.',
    );
  });
});

describe('describeFunnelChart', () => {
  it('summarises first and last stage', () => {
    expect(
      describeFunnelChart({
        labels: ['Visits', 'Signups', 'Paid'],
        datasets: [{ data: [200, 80, 20] }],
      }),
    ).toBe('Funnel chart with 3 stages. First: Visits (200). Last: Paid (20, 10% of first).');
  });

  it('handles empty data', () => {
    expect(describeFunnelChart({ labels: [], datasets: [{ data: [] }] })).toBe(
      'Funnel chart with no data.',
    );
  });
});

describe('describeScatterChart', () => {
  it('summarises point count and ranges', () => {
    expect(
      describeScatterChart({
        type: 'scatter',
        datasets: [
          {
            data: [
              { x: 1, y: 10 },
              { x: 5, y: 2 },
            ],
          },
        ],
        xAxisLabel: 'Age',
      }),
    ).toBe('Scatter chart with 2 points. Age ranges from 1 to 5. Y ranges from 2 to 10.');
  });

  it('includes bubble sizes and reports missing values', () => {
    const summary = describeScatterChart({
      type: 'bubble',
      datasets: [
        {
          data: [
            { x: 1, y: 1, size: 3 },
            { x: 2, y: 2, size: 9 },
            { x: null, y: 4, isNull: true },
          ],
        },
      ],
    });

    expect(summary).toContain('Bubble chart with 2 points.');
    expect(summary).toContain('Bubble size ranges from 3 to 9.');
    expect(summary).toContain('1 point has a missing value.');
  });

  it('handles empty data', () => {
    expect(describeScatterChart({ type: 'scatter', datasets: [] })).toBe(
      'Scatter chart with no data.',
    );
  });
});
