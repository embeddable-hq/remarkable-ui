import { ChartData } from 'chart.js';

export type ChartA11yProps = {
  /** Accessible name. Defaults to the enclosing Card's title, then to the chart type. */
  ariaLabel?: string;
  /** Accessible description. Defaults to a generated summary of the data (in English). */
  ariaDescription?: string;
};

type Labels = readonly unknown[] | undefined;
type Datasets = ChartData<'bar' | 'line' | 'pie' | 'funnel'>['datasets'];

const MAX_DESCRIBED_SERIES = 5;

const formatNumber = (value: number) => value.toLocaleString();

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const plural = (count: number, singular: string, pluralForm: string) =>
  `${count} ${count === 1 ? singular : pluralForm}`;

const labelAt = (labels: Labels, index: number) =>
  labels?.[index] != null ? String(labels[index]) : `#${index + 1}`;

const formatPercentage = (part: number, whole: number) =>
  `${Math.round((part / whole) * 1000) / 10}%`;

type IndexedValue = { index: number; value: number };

const getNumericValues = (data: readonly unknown[]): IndexedValue[] =>
  data.flatMap((value, index) => (isNumber(value) ? [{ index, value }] : []));

type NonEmptyValues = [IndexedValue, ...IndexedValue[]];

const isNonEmpty = (values: IndexedValue[]): values is NonEmptyValues => values.length > 0;

const getExtremes = ([first, ...rest]: NonEmptyValues) =>
  rest.reduce(
    (acc, item) => ({
      highest: item.value > acc.highest.value ? item : acc.highest,
      lowest: item.value < acc.lowest.value ? item : acc.lowest,
    }),
    { highest: first, lowest: first },
  );

export const describeCartesianChart = ({
  type,
  data,
  xAxisLabel,
  yAxisLabel,
}: {
  type: 'bar' | 'line';
  data: ChartData<'bar' | 'line'>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}): string => {
  const typeLabel = type === 'bar' ? 'Bar chart' : 'Line chart';
  const datasets = (data.datasets ?? []) as Datasets;
  const categoryCount = data.labels?.length ?? Math.max(0, ...datasets.map((d) => d.data.length));

  if (datasets.length === 0 || categoryCount === 0) return `${typeLabel} with no data.`;

  const parts = [
    `${typeLabel} with ${plural(categoryCount, 'category', 'categories')}${
      datasets.length > 1 ? ` and ${datasets.length} series` : ''
    }.`,
  ];
  if (xAxisLabel) parts.push(`X axis: ${xAxisLabel}.`);
  if (yAxisLabel) parts.push(`Y axis: ${yAxisLabel}.`);

  datasets.slice(0, MAX_DESCRIBED_SERIES).forEach((dataset, datasetIndex) => {
    const values = getNumericValues(dataset.data);
    if (!isNonEmpty(values)) return;

    const name = dataset.label ?? (datasets.length > 1 ? `Series ${datasetIndex + 1}` : undefined);
    const prefix = name ? `${name}: ` : '';
    const { highest, lowest } = getExtremes(values);

    const details =
      highest.index === lowest.index
        ? `${labelAt(data.labels, highest.index)} (${formatNumber(highest.value)})`
        : `highest ${labelAt(data.labels, highest.index)} (${formatNumber(highest.value)}), lowest ${labelAt(data.labels, lowest.index)} (${formatNumber(lowest.value)})`;
    parts.push(`${prefix}${details}.`);

    if (type === 'line' && values.length > 1) {
      parts.push(
        `${prefix}starts at ${formatNumber(values[0].value)}, ends at ${formatNumber((values[values.length - 1] ?? values[0]).value)}.`,
      );
    }
  });

  if (datasets.length > MAX_DESCRIBED_SERIES) {
    parts.push(`${datasets.length - MAX_DESCRIBED_SERIES} more series not described.`);
  }

  return parts.join(' ');
};

export const describePieChart = ({
  type,
  data,
}: {
  type: 'pie' | 'donut';
  data: ChartData<'pie'>;
}): string => {
  const typeLabel = type === 'pie' ? 'Pie chart' : 'Donut chart';
  const values = getNumericValues(data.datasets?.[0]?.data ?? []);

  if (!isNonEmpty(values)) return `${typeLabel} with no data.`;

  const total = values.reduce((sum, item) => sum + item.value, 0);
  const { highest, lowest } = getExtremes(values);
  const describe = ({ index, value }: IndexedValue) =>
    `${labelAt(data.labels, index)} (${formatNumber(value)}${
      total > 0 ? `, ${formatPercentage(value, total)}` : ''
    })`;

  const parts = [
    `${typeLabel} with ${plural(values.length, 'slice', 'slices')} totalling ${formatNumber(total)}.`,
    `Largest: ${describe(highest)}.`,
  ];
  if (values.length > 1) parts.push(`Smallest: ${describe(lowest)}.`);

  return parts.join(' ');
};

export const describeFunnelChart = (data: ChartData<'funnel'>): string => {
  const values = getNumericValues(data.datasets?.[0]?.data ?? []);

  if (!isNonEmpty(values)) return 'Funnel chart with no data.';

  const first = values[0];
  const last = values[values.length - 1] ?? first;
  const parts = [
    `Funnel chart with ${plural(values.length, 'stage', 'stages')}.`,
    `First: ${labelAt(data.labels, first.index)} (${formatNumber(first.value)}).`,
  ];
  if (values.length > 1) {
    parts.push(
      `Last: ${labelAt(data.labels, last.index)} (${formatNumber(last.value)}${
        first.value > 0 ? `, ${formatPercentage(last.value, first.value)} of first` : ''
      }).`,
    );
  }

  return parts.join(' ');
};

type ScatterLikePoint = {
  x: number | null;
  y: number | null;
  size?: number | null;
  isNull?: boolean;
};

const describeRange = (name: string, values: number[]) =>
  values.length === 0
    ? ''
    : ` ${name} ranges from ${formatNumber(Math.min(...values))} to ${formatNumber(Math.max(...values))}.`;

export const describeScatterChart = ({
  type,
  datasets,
  xAxisLabel,
  yAxisLabel,
}: {
  type: 'scatter' | 'bubble';
  datasets: ReadonlyArray<{ data: readonly unknown[] }>;
  xAxisLabel?: string;
  yAxisLabel?: string;
}): string => {
  const typeLabel = type === 'scatter' ? 'Scatter chart' : 'Bubble chart';
  const points = datasets.flatMap((dataset) => dataset.data as ScatterLikePoint[]);
  const plotted = points.filter((p) => !p?.isNull && isNumber(p?.x) && isNumber(p?.y));
  const missing = points.length - plotted.length;

  if (points.length === 0) return `${typeLabel} with no data.`;

  const sizes = plotted.map((p) => p.size).filter(isNumber);

  return (
    `${typeLabel} with ${plural(plotted.length, 'point', 'points')}${
      datasets.length > 1 ? ` in ${datasets.length} series` : ''
    }.` +
    describeRange(
      xAxisLabel ?? 'X',
      plotted.map((p) => p.x as number),
    ) +
    describeRange(
      yAxisLabel ?? 'Y',
      plotted.map((p) => p.y as number),
    ) +
    (type === 'bubble' ? describeRange('Bubble size', sizes) : '') +
    (missing > 0 ? ` ${plural(missing, 'point has', 'points have')} a missing value.` : '')
  );
};
