import { ChartData, ChartDataset, ChartOptions, Plugin, TooltipItem } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { getChartColors } from '../charts.constants';
import { mergician } from 'mergician';
import {
  BubbleChartConfigurationProps,
  BubbleChartInputPoint,
  ScatterChartConfigurationProps,
  ScatterChartInputPoint,
} from './scatter.types';
import {
  computeScatterNullBand,
  createScatterNullBandPlugin,
  type ScatterNullBandResult,
} from './scatter.nullBand.utils';
import {
  getChartjsAxisOptions,
  chartjsAxisOptionsLayoutPadding,
  getChartjsAxisOptionsScalesTicksDefault,
  getChartjsAxisOptionsScalesTicksMuted,
} from '../chartjs.cartesian.constants';
import { getStyle, getStyleNumber } from '../../../styles/styles.utils';

const defaultScatterNumberFormat = new Intl.NumberFormat();

export type ScatterDatasetWithOriginal = ChartDataset<'scatter', { x: number; y: number }[]> & {
  originalData?: ScatterChartInputPoint[];
};

/** True for null/undefined and non-finite numbers (NaN, ±Infinity). */
const isMeasureMissing = (v: number | null | undefined): boolean =>
  v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v));

export const hasNullMeasure = (pt: ScatterChartInputPoint | undefined): boolean => {
  if (!pt || typeof pt !== 'object') return false;
  if (pt.isNull) return true;
  return isMeasureMissing(pt.x) || isMeasureMissing(pt.y);
};

/** For logarithmic Y: Y must be > 0; X stays linear so any finite x is allowed. */
export const filterNumericScatterData = (
  data: ChartData<'scatter', ScatterChartInputPoint[]>,
): ChartData<'scatter', ScatterChartInputPoint[]> => ({
  ...data,
  datasets: data.datasets.map((ds) => ({
    ...ds,
    data: ds.data.filter(
      (p) =>
        p.x !== null &&
        p.x !== undefined &&
        p.y !== null &&
        p.y !== undefined &&
        Number.isFinite(p.x) &&
        Number.isFinite(p.y) &&
        (p.y as number) > 0,
    ),
  })),
});

export type ScatterChartDataContext = {
  nullBand: ScatterNullBandResult | null;
  supportsNullMeasures: boolean;
  opacityOverride?: { defaultOpacity: number; nullOpacity: number };
};

const getPointCaption = (raw: ScatterChartInputPoint | undefined): string | undefined => {
  if (!raw || typeof raw !== 'object') return undefined;
  return raw.pointLabel ?? raw.label;
};

const getOriginalScatterPoint = (context: Context): ScatterChartInputPoint | undefined => {
  const ds = context.dataset as ScatterDatasetWithOriginal;
  return (
    ds.originalData?.[context.dataIndex] ??
    (ds.data[context.dataIndex] as ScatterChartInputPoint | undefined)
  );
};

export const getColorWithOpacity = (color: string, alpha: number): string => {
  if (!color?.trim()) {
    return `rgba(33, 33, 41, ${alpha})`;
  }
  if (typeof document === 'undefined') {
    return color;
  }

  const el = document.createElement('span');
  el.style.color = color;
  document.body.appendChild(el);
  const rgb = getComputedStyle(el).color;
  el.remove();

  const m = rgb.match(/rgba?\(\s*(\d+)\s*(?:,\s*|\s+)(\d+)\s*(?:,\s*|\s+)(\d+)/i);
  if (!m) {
    return `rgba(33, 33, 41, ${alpha})`;
  }

  return `rgba(${m[1]}, ${m[2]}, ${m[3]}, ${alpha})`;
};

const getSeriesColor = (chartColors: string[], index: number): string =>
  chartColors[index % chartColors.length] ?? '';

const isUserControlledPointFill = (dataset: ChartDataset<'scatter'>): boolean =>
  dataset.pointBackgroundColor !== undefined || dataset.backgroundColor !== undefined;

const computeAxisMin = (
  userMin: number | undefined,
  computed: number | undefined,
): number | undefined => {
  if (computed === undefined) return userMin;
  if (userMin === undefined) return computed;
  return Math.min(userMin, computed);
};

const formatMeasureValue = (
  _axis: 'x' | 'y',
  value: number | null | undefined,
  nullLabel: string | undefined,
): string => {
  if (isMeasureMissing(value)) return nullLabel ?? 'No value';
  return defaultScatterNumberFormat.format(value as number);
};

const formatAxisTickValue = (tickValue: string | number): string => {
  const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
  if (!Number.isFinite(v)) return String(tickValue);
  return defaultScatterNumberFormat.format(v);
};

const getScatterTooltipLabel = (
  ctx: TooltipItem<'scatter'>,
  nullLabel: string | undefined,
  formatMeasureValue: (
    axis: 'x' | 'y',
    value: number | null | undefined,
    nullLabel: string | undefined,
  ) => string,
): string | string[] => {
  const ds = ctx.dataset as ScatterDatasetWithOriginal;
  const orig = ds.originalData?.[ctx.dataIndex];
  const prefix = ds.label ? `${ds.label}: ` : '';
  if (orig) {
    return `${prefix}(${formatMeasureValue('x', orig.x, nullLabel)}, ${formatMeasureValue('y', orig.y, nullLabel)})`;
  }
  const { x, y } = ctx.parsed;
  const fx = typeof x === 'number' ? formatMeasureValue('x', x, nullLabel) : String(x);
  const fy = typeof y === 'number' ? formatMeasureValue('y', y, nullLabel) : String(y);
  return `${prefix}(${fx}, ${fy})`;
};

export const getScatterDataWithNullBand = (
  data: ChartData<'scatter', ScatterChartInputPoint[]>,
  ctx: ScatterChartDataContext,
): ChartData<'scatter'> => {
  const chartColors = getChartColors();
  const defaultOpacity =
    ctx.opacityOverride?.defaultOpacity ?? getStyleNumber('--em-scatterchart-point-opacity', '0.8');
  const nullOpacity =
    ctx.opacityOverride?.nullOpacity ??
    getStyleNumber('--em-scatterchart-point-opacity--null', '0.3');
  const pointRadiusPx = getStyleNumber('--em-scatterchart-point-radius', '0.375rem');
  const pointHoverRadiusPx = getStyleNumber('--em-scatterchart-point-radius--hover', '0.5rem');

  const useNullBandMapping = ctx.supportsNullMeasures && ctx.nullBand !== null;

  return {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const baseColor = getSeriesColor(chartColors, index);

        const defaultDataset: Partial<ScatterDatasetWithOriginal> = {
          showLine: false,
          pointRadius: pointRadiusPx,
          pointHoverRadius: pointHoverRadiusPx,
        };

        if (!isUserControlledPointFill(dataset)) {
          // Resolve the two opacity variants once per series (2 DOM mutations max, not N)
          const defaultColor = getColorWithOpacity(baseColor, defaultOpacity);
          const nullColor = getColorWithOpacity(baseColor, nullOpacity);
          const colorFor = (c: { dataset: object; dataIndex: number }) => {
            const orig =
              (c.dataset as ScatterDatasetWithOriginal).originalData?.[c.dataIndex] ??
              (c.dataset as { data: ScatterChartInputPoint[] }).data[c.dataIndex];
            return hasNullMeasure(orig) ? nullColor : defaultColor;
          };
          defaultDataset.pointBackgroundColor = colorFor;
          defaultDataset.pointBorderColor = colorFor;
          defaultDataset.backgroundColor = baseColor;
          defaultDataset.borderColor = baseColor;
        } else {
          defaultDataset.backgroundColor = dataset.backgroundColor ?? baseColor;
          defaultDataset.borderColor = dataset.borderColor ?? baseColor;
        }

        if (!useNullBandMapping || !ctx.nullBand) {
          return mergician(
            defaultDataset,
            { originalData: [...dataset.data] },
            dataset,
          ) as ScatterDatasetWithOriginal;
        }

        const { xNullPos, yNullPos } = ctx.nullBand;
        const mappedData = dataset.data.map((pt) => ({
          x: isMeasureMissing(pt.x) ? xNullPos : (pt.x as number),
          y: isMeasureMissing(pt.y) ? yNullPos : (pt.y as number),
        }));

        return mergician(defaultDataset, dataset, {
          data: mappedData,
          originalData: [...dataset.data],
        }) as ScatterDatasetWithOriginal;
      }) || [],
  };
};

export const getScatterNullBand = (
  datasets: { data: ScatterChartInputPoint[] }[],
  showLogarithmicScale: boolean | undefined,
): ScatterNullBandResult | null => {
  if (showLogarithmicScale) return null;
  return computeScatterNullBand(datasets);
};

export const getScatterChartData = (
  data: ChartData<'scatter', ScatterChartInputPoint[]>,
  props: ScatterChartConfigurationProps & { nullBand: ScatterNullBandResult | null },
): ChartData<'scatter'> => {
  const dataForChart = props.showLogarithmicScale ? filterNumericScatterData(data) : data;
  return getScatterDataWithNullBand(dataForChart, {
    nullBand: props.nullBand,
    supportsNullMeasures: !props.showLogarithmicScale,
  });
};

export const getScatterChartPlugins = (
  nullBand: ScatterNullBandResult | null,
): Plugin<'scatter'>[] | undefined => {
  const plugin = nullBand ? createScatterNullBandPlugin(nullBand) : undefined;
  return plugin ? [plugin] : undefined;
};

const isValueLabelVisible = (context: Context, showValueLabels: boolean | undefined): boolean => {
  if (!showValueLabels) return false;
  const raw = getOriginalScatterPoint(context);
  if (!raw || typeof raw !== 'object') return false;
  const yScale = context.chart.scales.y;
  const xScale = context.chart.scales.x;
  if (!yScale || !xScale) return false;

  const mapped = context.dataset.data[context.dataIndex] as { x: number; y: number } | undefined;
  if (!mapped || typeof mapped.x !== 'number' || typeof mapped.y !== 'number') return false;
  const { x: mx, y: my } = mapped;

  if (yScale.type === 'logarithmic' && (my <= 0 || !Number.isFinite(my))) return false;
  if (xScale.type === 'logarithmic' && (mx <= 0 || !Number.isFinite(mx))) return false;

  return my >= yScale.min && my <= yScale.max && mx >= xScale.min && mx <= xScale.max;
};

const isPointLabelVisible = (context: Context, showPointLabels: boolean | undefined): boolean => {
  if (!showPointLabels) return false;
  const raw = getOriginalScatterPoint(context);
  return Boolean(getPointCaption(raw));
};

const getScatterChartAxisBorderPatch = (): Partial<ChartOptions<'scatter'>> => {
  const color = getStyle('--em-chart-grid-line-color--subtle', '#B8B8BD');
  const width = Math.max(1, getStyleNumber('--em-chart-grid-line-width--thin', '1px'));
  const border = { display: true as const, color, width };
  return {
    scales: {
      x: { border },
      y: { border },
    },
  };
};

const getScatterBaseOptions = (
  options: ScatterChartConfigurationProps,
  nullContext?: { nullBand: ScatterNullBandResult | null; nullBandLabel?: string },
): Partial<ChartOptions<'scatter'>> => {
  const pointRadius = getStyleNumber('--em-scatterchart-point-radius', '0.375rem');
  const pointHoverRadius = getStyleNumber('--em-scatterchart-point-radius--hover', '0.5rem');
  const borderWidth = getStyleNumber('--em-scatterchart-point-border-width', '0.0625rem');
  const labelStackHeight = getStyleNumber('--em-scatterchart-label-stack-height', '1.25rem');
  const labelStackGap = getStyleNumber('--em-scatterchart-label-stack-gap', '0.25rem');
  const labelOffset = getStyleNumber('--em-scatterchart-label-offset', '0.375rem');
  const labelTopPadding = getStyleNumber('--em-scatterchart-label-top-padding', '1.75rem');
  const labelStrokeWidth = getStyleNumber('--em-scatterchart-label-stroke-width', '3');
  const labelLift = pointRadius + labelOffset;

  const nullBand = nullContext?.nullBand;
  const nullBandLabel = nullContext?.nullBandLabel;
  const applyNullX = !options.showLogarithmicScale && Boolean(nullBand?.hasNullX);
  const applyNullY = !options.showLogarithmicScale && Boolean(nullBand?.hasNullY);

  const ticksDefault = getChartjsAxisOptionsScalesTicksDefault();
  const ticksMuted = getChartjsAxisOptionsScalesTicksMuted();

  const valueLabelOffset = (context: Context): number => {
    const showValueLabel = isValueLabelVisible(context, options.showValueLabels);
    const showPointLabel = isPointLabelVisible(context, options.showPointLabels);
    if (!showValueLabel) return 0;
    if (showPointLabel) return labelLift + labelStackHeight;
    return labelLift;
  };

  const captionLabelOffset = (context: Context): number => {
    const showValueLabel = isValueLabelVisible(context, options.showValueLabels);
    const showPointLabel = isPointLabelVisible(context, options.showPointLabels);
    if (!showPointLabel) return 0;
    if (showValueLabel) return labelLift + labelStackGap;
    return labelLift;
  };

  const newOptions: Partial<ChartOptions<'scatter'>> = {
    interaction: {
      mode: 'nearest',
      intersect: true,
    },
    elements: {
      point: {
        radius: pointRadius,
        hoverRadius: pointHoverRadius,
        borderWidth,
      },
    },
    layout: {
      padding: {
        top:
          options.showValueLabels || options.showPointLabels
            ? chartjsAxisOptionsLayoutPadding + pointRadius + labelTopPadding
            : 0,
      },
    },
    plugins: {
      datalabels: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        padding: 0,
        color: getStyle('--em-chart-label-color', '#212129'),
        textStrokeColor: getStyle('--em-chart-label-background', '#FFF'),
        textStrokeWidth: labelStrokeWidth,
        labels: {
          total: {
            display: false,
          },
          value: {
            display: (context) =>
              isValueLabelVisible(context, options.showValueLabels) ? 'auto' : false,
            anchor: 'center',
            align: 'top',
            offset: valueLabelOffset,
            formatter: (_value, context) => {
              const raw = getOriginalScatterPoint(context);
              if (!raw || typeof raw !== 'object') return '';
              const xs = formatMeasureValue('x', raw.x, nullBandLabel);
              const ys = formatMeasureValue('y', raw.y, nullBandLabel);
              return `(${xs}, ${ys})`;
            },
          },
          caption: {
            display: (context) =>
              isPointLabelVisible(context, options.showPointLabels) ? 'auto' : false,
            anchor: 'center',
            align: 'top',
            offset: captionLabelOffset,
            formatter: (_value, context) => {
              const raw = getOriginalScatterPoint(context);
              return getPointCaption(raw) ?? '';
            },
          },
        },
      },
      legend: {
        display: options.showLegend,
      },
      tooltip: {
        enabled: options.showTooltips,
        callbacks: {
          label: (ctx) => getScatterTooltipLabel(ctx, nullBandLabel, formatMeasureValue),
        },
      },
    },
    scales: {
      x: {
        // Match line charts: only the value axis (Y) uses log; X stays linear for correct point spread.
        type: 'linear',
        grid: { display: false },
        ticks: {
          ...ticksDefault,
          callback: formatAxisTickValue,
        },
        title: {
          display: Boolean(options.xAxisLabel),
          text: options.xAxisLabel,
        },
        reverse: options.reverseXAxis,
        min: computeAxisMin(
          options.xAxisRangeMin,
          applyNullX ? nullBand?.computedXAxisMin : undefined,
        ),
        max: options.xAxisRangeMax,
      },
      y: {
        type: options.showLogarithmicScale ? 'logarithmic' : 'linear',
        ...(!options.showLogarithmicScale ? { grace: '5%' } : {}),
        grid: { display: false },
        ticks: {
          ...ticksMuted,
          callback: formatAxisTickValue,
        },
        title: {
          display: Boolean(options.yAxisLabel),
          text: options.yAxisLabel,
        },
        min: computeAxisMin(
          options.yAxisRangeMin,
          applyNullY ? nullBand?.computedYAxisMin : undefined,
        ),
        max: options.yAxisRangeMax,
      },
    },
  };

  return mergician(getChartjsAxisOptions(), newOptions);
};

export const getScatterChartOptions = (
  config: ScatterChartConfigurationProps & { nullBand?: ScatterNullBandResult | null },
): Partial<ChartOptions<'scatter'>> => {
  const { nullBand, nullBandLabel, showLogarithmicScale } = config;
  const options = mergician(
    getScatterBaseOptions(config, { nullBand: nullBand ?? null, nullBandLabel }),
    getScatterChartAxisBorderPatch(),
  ) as Partial<ChartOptions<'scatter'>>;
  if (!nullBand || showLogarithmicScale) return options;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const existingScales = (options.scales ?? {}) as Record<string, any>;
  const scales = { ...existingScales };

  if (nullBand.hasNullX) {
    const { xNullPos } = nullBand;
    const xScale = existingScales.x ?? {};
    const prevCb = xScale.ticks?.callback as ((v: string | number) => string) | undefined;
    scales.x = {
      ...xScale,
      ticks: {
        ...xScale.ticks,
        callback: (tickValue: string | number) => {
          const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
          if (Number.isFinite(v) && Math.abs(v - xNullPos) < 1e-9) return nullBandLabel;
          return prevCb?.(tickValue) ?? formatAxisTickValue(tickValue);
        },
      },
    };
  }

  if (nullBand.hasNullY) {
    const { yNullPos } = nullBand;
    const yScale = existingScales.y ?? {};
    const prevCb = yScale.ticks?.callback as ((v: string | number) => string) | undefined;
    scales.y = {
      ...yScale,
      ticks: {
        ...yScale.ticks,
        callback: (tickValue: string | number) => {
          const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
          if (Number.isFinite(v) && Math.abs(v - yNullPos) < 1e-9) return nullBandLabel;
          return prevCb?.(tickValue) ?? formatAxisTickValue(tickValue);
        },
      },
    };
  }

  return { ...options, scales };
};

// ─── Bubble Chart ────────────────────────────────────────────────────────────

export type BubbleDatasetWithOriginal = ChartDataset<
  'bubble',
  { x: number; y: number; r: number }[]
> & {
  originalData?: BubbleChartInputPoint[];
  computedRadii?: number[];
};

const computeMaxBubbleSize = (datasets: { data: BubbleChartInputPoint[] }[]): number => {
  let max = 0;
  for (const ds of datasets) {
    for (const pt of ds.data) {
      if (!isMeasureMissing(pt.size) && (pt.size as number) > 0) {
        max = Math.max(max, pt.size as number);
      }
    }
  }
  return max;
};

const computeBubbleRadius = (
  size: number | null | undefined,
  maxBubbleSize: number,
  bubbleMinRadiusPx: number,
  bubbleMaxRadiusPx: number,
): number => {
  if (isMeasureMissing(size) || (size as number) <= 0 || maxBubbleSize <= 0)
    return bubbleMinRadiusPx;
  return Math.max(
    bubbleMinRadiusPx,
    Math.sqrt((size as number) / maxBubbleSize) * bubbleMaxRadiusPx,
  );
};

const getBubbleTooltipLabel = (
  ctx: TooltipItem<'bubble'>,
  nullLabel: string | undefined,
): string => {
  const ds = ctx.dataset as BubbleDatasetWithOriginal;
  const orig = ds.originalData?.[ctx.dataIndex];
  const prefix = ds.label ? `${ds.label}: ` : '';
  const x = orig ? formatMeasureValue('x', orig.x, nullLabel) : String(ctx.parsed.x);
  const y = orig ? formatMeasureValue('y', orig.y, nullLabel) : String(ctx.parsed.y);
  const size = isMeasureMissing(orig?.size)
    ? (nullLabel ?? 'No value')
    : defaultScatterNumberFormat.format(orig!.size as number);
  return `${prefix}(${x}, ${y}, ${size})`;
};

export const getBubbleChartData = (
  data: ChartData<'bubble', BubbleChartInputPoint[]>,
  props: BubbleChartConfigurationProps & { nullBand: ScatterNullBandResult | null },
): ChartData<'bubble'> => {
  const defaultOpacity = getStyleNumber('--em-bubblechart-point-opacity', '0.7');
  const nullOpacity = getStyleNumber('--em-bubblechart-point-opacity--null', '0.3');
  const bubbleMinRadiusPx =
    props.bubbleRadiusMin ?? getStyleNumber('--em-bubblechart-point-radius--min', '5');
  const bubbleMaxRadiusPx =
    props.bubbleRadiusMax ?? getStyleNumber('--em-bubblechart-point-radius--max', '40');

  const bubbleDataAsScatter = (props.showLogarithmicScale
    ? filterNumericScatterData(data as unknown as ChartData<'scatter', ScatterChartInputPoint[]>)
    : data) as unknown as ChartData<'scatter', ScatterChartInputPoint[]>;

  const scatterDataWithNullBand = getScatterDataWithNullBand(bubbleDataAsScatter, {
    nullBand: props.nullBand,
    supportsNullMeasures: !props.showLogarithmicScale,
    opacityOverride: { defaultOpacity, nullOpacity },
  });

  const maxBubbleSize = computeMaxBubbleSize(
    (bubbleDataAsScatter as unknown as ChartData<'bubble', BubbleChartInputPoint[]>).datasets,
  );

  return {
    ...scatterDataWithNullBand,
    datasets: scatterDataWithNullBand.datasets.map((dataset) => {
      const originalBubbleData = (dataset as ScatterDatasetWithOriginal)
        .originalData as unknown as BubbleChartInputPoint[];
      const computedRadii = (originalBubbleData ?? []).map((point) =>
        computeBubbleRadius(point.size, maxBubbleSize, bubbleMinRadiusPx, bubbleMaxRadiusPx),
      );
      return {
        ...dataset,
        data: (dataset.data as { x: number; y: number }[]).map((pt, i) => ({
          ...pt,
          r: computedRadii[i],
        })),
        computedRadii,
      } as unknown as BubbleDatasetWithOriginal;
    }),
  } as unknown as ChartData<'bubble'>;
};

export const getBubbleChartOptions = (
  config: BubbleChartConfigurationProps & { nullBand?: ScatterNullBandResult | null },
): Partial<ChartOptions<'bubble'>> => {
  const { nullBandLabel } = config;
  const bubbleMinRadiusPx =
    config.bubbleRadiusMin ?? getStyleNumber('--em-bubblechart-point-radius--min', '5');
  const bubbleHoverScale = getStyleNumber('--em-bubblechart-point-radius--hover--scale', '1.2');
  const bubbleBorderWidth = getStyleNumber('--em-bubblechart-point-border-width', '1');

  const scatterBaseOptions = getScatterChartOptions(config) as unknown as Partial<
    ChartOptions<'bubble'>
  >;

  return mergician(scatterBaseOptions, {
    elements: {
      point: {
        borderWidth: bubbleBorderWidth,
        hoverRadius: ((ctx: { dataIndex: number; dataset: BubbleDatasetWithOriginal }) => {
          const r = ctx.dataset.computedRadii?.[ctx.dataIndex] ?? bubbleMinRadiusPx;
          return r * (bubbleHoverScale - 1);
        }) as unknown as number,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: TooltipItem<'bubble'>) => getBubbleTooltipLabel(ctx, nullBandLabel),
        },
      },
    },
  }) as Partial<ChartOptions<'bubble'>>;
};
