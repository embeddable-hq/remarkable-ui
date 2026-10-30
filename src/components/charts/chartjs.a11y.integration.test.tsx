import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BarChart } from './bars/BarChart';
import { LineChart } from './lines/LineChart';
import { PieChart } from './pies/PieChart/PieChart';
import { DonutChart } from './pies/DonutChart/DonutChart';
import { ScatterChart } from './scatter/ScatterChart/ScatterChart';
import { BubbleChart } from './scatter/BubbleChart/BubbleChart';
import { FunnelChart } from './funnel/FunnelChart';
import { Card, CardHeader } from '../shared/Card/Card';

// Mirrors react-chartjs-2, which renders <canvas role="img"> and forwards extra props to it
vi.mock('react-chartjs-2', async () => {
  const { forwardRef } = await import('react');
  type CanvasProps = React.CanvasHTMLAttributes<HTMLCanvasElement> & Record<string, unknown>;
  const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(
    (
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      { data, options, plugins, type, ...props }: CanvasProps,
      ref,
    ) => <canvas role="img" ref={ref} {...props} />,
  );
  return {
    Bar: Canvas,
    Line: Canvas,
    Pie: Canvas,
    Scatter: Canvas,
    Bubble: Canvas,
    Chart: Canvas,
    getElementAtEvent: vi.fn(() => []),
    getElementsAtEvent: vi.fn(() => []),
    getDatasetAtEvent: vi.fn(() => []),
  };
});

vi.mock('../../hooks/useResizeObserver.hook', () => ({
  useResizeObserver: () => ({ width: 300, height: 300 }),
}));

const CARTESIAN = { labels: ['A', 'B'], datasets: [{ label: 'S', data: [1, 2] }] };
const PIE = { labels: ['A', 'B'], datasets: [{ data: [1, 2] }] };
const POINTS = { datasets: [{ data: [{ x: 1, y: 2 }] }] };

const CHARTS: Array<[string, (props: object) => React.ReactElement, string]> = [
  ['BarChart', (p) => <BarChart data={CARTESIAN} {...p} />, 'Bar chart'],
  ['LineChart', (p) => <LineChart data={CARTESIAN} {...p} />, 'Line chart'],
  ['PieChart', (p) => <PieChart data={PIE} {...p} />, 'Pie chart'],
  ['DonutChart', (p) => <DonutChart data={PIE} {...p} />, 'Donut chart'],
  ['ScatterChart', (p) => <ScatterChart data={POINTS} {...p} />, 'Scatter chart'],
  ['BubbleChart', (p) => <BubbleChart data={POINTS} {...p} />, 'Bubble chart'],
  ['FunnelChart', (p) => <FunnelChart data={PIE} {...p} />, 'Funnel chart'],
];

describe.each(CHARTS)('%s accessibility', (_name, renderChart, defaultLabel) => {
  it('falls back to the chart type as its name', () => {
    render(renderChart({}));

    expect(screen.getByRole('img')).toHaveAccessibleName(defaultLabel);
  });

  it('uses the ariaLabel prop as its name', () => {
    render(renderChart({ ariaLabel: 'Revenue by month' }));

    expect(screen.getByRole('img')).toHaveAccessibleName('Revenue by month');
  });

  it('is described by a generated summary', () => {
    render(renderChart({}));

    expect(screen.getByRole('img')).toHaveAccessibleDescription(
      new RegExp(`^${defaultLabel} with`),
    );
  });

  it('uses ariaDescription instead of the generated summary', () => {
    render(renderChart({ ariaDescription: 'Custom description' }));

    expect(screen.getByRole('img')).toHaveAccessibleDescription('Custom description');
  });

  it('is named by the enclosing Card title', () => {
    render(
      <Card>
        <CardHeader title="Revenue overview" />
        {renderChart({})}
      </Card>,
    );

    expect(screen.getByRole('img')).toHaveAccessibleName('Revenue overview');
  });

  it('prefers ariaLabel over the Card title', () => {
    render(
      <Card>
        <CardHeader title="Revenue overview" />
        {renderChart({ ariaLabel: 'Custom' })}
      </Card>,
    );

    expect(screen.getByRole('img')).toHaveAccessibleName('Custom');
  });

  it('keeps the chart type as its name when the Card has no title', () => {
    render(
      <Card>
        <CardHeader subtitle="Only a subtitle" />
        {renderChart({})}
      </Card>,
    );

    expect(screen.getByRole('img')).toHaveAccessibleName(defaultLabel);
  });
});
