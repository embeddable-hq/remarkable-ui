import { useChartA11y } from '../useChartA11y.hook';
import { describeScatterChart } from '../chartjs.a11y.utils';

const DEFAULT_LABELS = { scatter: 'Scatter chart', bubble: 'Bubble chart' } as const;

export const useScatterChartA11y = ({
  type,
  datasets,
  ariaLabel,
  ariaDescription,
  xAxisLabel,
  yAxisLabel,
}: {
  type: 'scatter' | 'bubble';
  datasets: Parameters<typeof describeScatterChart>[0]['datasets'];
  ariaLabel?: string;
  ariaDescription?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
}) =>
  useChartA11y({
    ariaLabel,
    ariaDescription,
    defaultLabel: DEFAULT_LABELS[type],
    getSummary: () => describeScatterChart({ type, datasets, xAxisLabel, yAxisLabel }),
    summaryDeps: [datasets, xAxisLabel, yAxisLabel],
  });
