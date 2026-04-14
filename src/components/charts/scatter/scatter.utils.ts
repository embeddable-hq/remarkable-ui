import { ChartData, ChartDataset, ChartOptions, Plugin, TooltipItem } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { getChartColors } from '../charts.constants';
import { mergician } from 'mergician';
import { ScatterChartConfigurationProps, ScatterChartInputPoint } from './scatter.types';
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

const getScatterPointRadiusPx = (): number =>
  getStyleNumber('--em-scatterchart-point-radius', '6px');

export type ScatterDatasetWithOriginal = ChartDataset<'scatter', { x: number; y: number }[]> & {
  originalData?: ScatterChartInputPoint[];
};

/** True for null/undefined and non-finite numbers (NaN, ±Infinity). */
const measureIsMissing = (v: number | null | undefined): boolean =>
  v === null || v === undefined || (typeof v === 'number' && !Number.isFinite(v));

export const pointHasNullMeasure = (pt: ScatterChartInputPoint | undefined): boolean => {
  if (!pt || typeof pt !== 'object') return false;
  if (pt.isNull) return true;
  return measureIsMissing(pt.x) || measureIsMissing(pt.y);
};

/** For logarithmic Y: Y must be > 0; X stays linear so any finite x is allowed. */
export function filterNumericScatterData(
  data: ChartData<'scatter', ScatterChartInputPoint[]>,
): ChartData<'scatter', ScatterChartInputPoint[]> {
  return {
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
  };
}

export type ScatterChartDataContext = {
  nullBand: ScatterNullBandResult | null;
  supportsNullMeasures: boolean;
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

export const applyOpacityToColor = (color: string, alpha: number): string => {
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

const resolveSeriesColor = (chartColors: string[], index: number): string =>
  chartColors[index % chartColors.length] ?? '';

const userControlsPointFill = (dataset: ChartDataset<'scatter'>): boolean =>
  dataset.pointBackgroundColor !== undefined || dataset.backgroundColor !== undefined;

const mergeAxisMin = (
  userMin: number | undefined,
  computed: number | undefined,
): number | undefined => {
  if (computed === undefined) return userMin;
  if (userMin === undefined) return computed;
  return Math.min(userMin, computed);
};

function defaultFormatMeasureValue(
  _axis: 'x' | 'y',
  value: number | null | undefined,
  nullLabel: string,
): string {
  if (measureIsMissing(value)) return nullLabel;
  return defaultScatterNumberFormat.format(value as number);
}

function formatAxisTickValue(tickValue: string | number): string {
  const v = typeof tickValue === 'number' ? tickValue : Number(tickValue);
  if (!Number.isFinite(v)) return String(tickValue);
  return defaultScatterNumberFormat.format(v);
}

function scatterTooltipLabel(
  ctx: TooltipItem<'scatter'>,
  nullLabel: string,
  formatMeasureValue: (
    axis: 'x' | 'y',
    value: number | null | undefined,
    nullLabel: string,
  ) => string,
): string | string[] {
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
}

export const applyScatterNullBandToData = (
  data: ChartData<'scatter', ScatterChartInputPoint[]>,
  ctx: ScatterChartDataContext,
): ChartData<'scatter'> => {
  const chartColors = getChartColors();
  const defaultOpacity = getStyleNumber('--em-scatterchart-opacity', '0.8');
  const nullOpacity = getStyleNumber('--em-scatterchart-null-opacity', '0.3');
  const pointRadiusPx = getScatterPointRadiusPx();
  const pointHoverRadiusPx = pointRadiusPx * (4 / 3);

  const useNullBandMapping =
    ctx.supportsNullMeasures &&
    ctx.nullBand !== null &&
    (ctx.nullBand.hasNullX || ctx.nullBand.hasNullY);

  return {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) => {
        const baseColor = resolveSeriesColor(chartColors, index);

        const defaultDataset: Partial<ScatterDatasetWithOriginal> = {
          showLine: false,
          pointRadius: pointRadiusPx,
          pointHoverRadius: pointHoverRadiusPx,
          originalData: [...dataset.data],
        };

        if (!userControlsPointFill(dataset)) {
          defaultDataset.pointBackgroundColor = (c) => {
            const orig =
              (c.dataset as ScatterDatasetWithOriginal).originalData?.[c.dataIndex] ??
              (c.dataset.data[c.dataIndex] as ScatterChartInputPoint | undefined);
            const alpha = pointHasNullMeasure(orig) ? nullOpacity : defaultOpacity;
            return applyOpacityToColor(baseColor, alpha);
          };
          defaultDataset.pointBorderColor = (c) => {
            const orig =
              (c.dataset as ScatterDatasetWithOriginal).originalData?.[c.dataIndex] ??
              (c.dataset.data[c.dataIndex] as ScatterChartInputPoint | undefined);
            const alpha = pointHasNullMeasure(orig) ? nullOpacity : defaultOpacity;
            return applyOpacityToColor(baseColor, alpha);
          };
          defaultDataset.backgroundColor = baseColor;
          defaultDataset.borderColor = baseColor;
        } else {
          defaultDataset.backgroundColor = dataset.backgroundColor ?? baseColor;
          defaultDataset.borderColor = dataset.borderColor ?? baseColor;
        }

        if (!useNullBandMapping || !ctx.nullBand) {
          return mergician(defaultDataset, dataset) as ScatterDatasetWithOriginal;
        }

        const { xNullPos, yNullPos } = ctx.nullBand;
        const mappedData = dataset.data.map((pt) => ({
          x: measureIsMissing(pt.x) ? xNullPos : (pt.x as number),
          y: measureIsMissing(pt.y) ? yNullPos : (pt.y as number),
        }));
        const originalData = [...dataset.data];

        if (!userControlsPointFill(dataset)) {
          const bgColors = dataset.data.map((pt) => {
            const alpha = pointHasNullMeasure(pt) ? nullOpacity : defaultOpacity;
            return applyOpacityToColor(baseColor, alpha);
          });
          return mergician(defaultDataset, dataset, {
            data: mappedData,
            originalData,
            pointBackgroundColor: bgColors,
            pointBorderColor: bgColors,
          }) as ScatterDatasetWithOriginal;
        }

        return mergician(defaultDataset, dataset, {
          data: mappedData,
          originalData,
        }) as ScatterDatasetWithOriginal;
      }) || [],
  };
};

export type ScatterChartDataResult = {
  chartData: ChartData<'scatter'>;
  nullBand: ScatterNullBandResult | null;
  nullBandPlugin: Plugin<'scatter'> | undefined;
};

export const getScatterChartPlugins = (
  result: ScatterChartDataResult,
): Plugin<'scatter'>[] | undefined => (result.nullBandPlugin ? [result.nullBandPlugin] : undefined);

export const getScatterChartData = (
  data: ChartData<'scatter', ScatterChartInputPoint[]>,
  props: ScatterChartConfigurationProps,
): ScatterChartDataResult => {
  const dataForChart = props.showLogarithmicScale ? filterNumericScatterData(data) : data;
  const nullBand = props.showLogarithmicScale
    ? null
    : computeScatterNullBand(dataForChart.datasets);
  const chartData = applyScatterNullBandToData(dataForChart, {
    nullBand,
    supportsNullMeasures: !props.showLogarithmicScale,
  });
  const nullBandPlugin =
    nullBand && !props.showLogarithmicScale && (nullBand.hasNullX || nullBand.hasNullY)
      ? createScatterNullBandPlugin({ nullBand })
      : undefined;
  return { chartData, nullBand, nullBandPlugin };
};

const valueLabelDisplay = (context: Context, showValueLabels: boolean | undefined): boolean => {
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

const pointLabelDisplay = (context: Context, showPointLabels: boolean | undefined): boolean => {
  if (!showPointLabels) return false;
  const raw = getOriginalScatterPoint(context);
  return Boolean(getPointCaption(raw));
};

export type ScatterChartOptionsNullContext = {
  nullBand: ScatterNullBandResult | null;
  nullBandLabel: string;
};

export const applyNullBandTickCallbacks = (
  options: Partial<ChartOptions<'scatter'>>,
  nullBand: ScatterNullBandResult | null,
  nullBandLabel: string,
  showLogarithmicScale?: boolean,
): Partial<ChartOptions<'scatter'>> => {
  if (!nullBand || showLogarithmicScale) return options;
  if (!nullBand.hasNullX && !nullBand.hasNullY) return options;

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

export const getScatterChartAxisBorderPatch = (): Partial<ChartOptions<'scatter'>> => {
  const color = getStyle('--em-chart-grid-line-color--subtle', '#B8B8BD');
  const w = getStyleNumber('--em-chart-grid-line-width--thin', '1px');
  const width = Math.max(1, w);
  const border = { display: true as const, color, width };
  return {
    scales: {
      x: { border },
      y: { border },
    },
  };
};

export const getScatterChartOptions = (
  options: ScatterChartConfigurationProps,
  nullContext?: ScatterChartOptionsNullContext,
): Partial<ChartOptions<'scatter'>> => {
  const pointRadius = getScatterPointRadiusPx();
  const borderWidth = getStyleNumber('--em-scatterchart-border-width', '1px');
  const labelLift = pointRadius + 6;

  const nullBand = nullContext?.nullBand ?? null;
  const nullBandLabel = nullContext?.nullBandLabel ?? 'No value';
  const applyNullX = !options.showLogarithmicScale && Boolean(nullBand?.hasNullX);
  const applyNullY = !options.showLogarithmicScale && Boolean(nullBand?.hasNullY);

  const ticksDefault = getChartjsAxisOptionsScalesTicksDefault();
  const ticksMuted = getChartjsAxisOptionsScalesTicksMuted();

  const xTickCallback = (tickValue: string | number) => formatAxisTickValue(tickValue);
  const yTickCallback = (tickValue: string | number) => formatAxisTickValue(tickValue);

  const valueLabelOffset = (context: Context): number => {
    const showV = valueLabelDisplay(context, options.showValueLabels);
    const showP = pointLabelDisplay(context, options.showPointLabels);
    if (!showV) return 0;
    if (showP) return labelLift + 20;
    return labelLift;
  };

  const captionLabelOffset = (context: Context): number => {
    const showV = valueLabelDisplay(context, options.showValueLabels);
    const showP = pointLabelDisplay(context, options.showPointLabels);
    if (!showP) return 0;
    if (showV) return labelLift + 4;
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
        hoverRadius: pointRadius * (4 / 3),
        borderWidth,
      },
    },
    layout: {
      padding: {
        top:
          options.showValueLabels || options.showPointLabels
            ? chartjsAxisOptionsLayoutPadding + pointRadius + 28
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
        textStrokeWidth: 3,
        labels: {
          total: {
            display: false,
          },
          value: {
            display: (context) =>
              valueLabelDisplay(context, options.showValueLabels) ? 'auto' : false,
            anchor: 'center',
            align: 'top',
            offset: valueLabelOffset,
            formatter: (_value, context) => {
              const raw = getOriginalScatterPoint(context);
              if (!raw || typeof raw !== 'object') return '';
              const xs = defaultFormatMeasureValue('x', raw.x, nullBandLabel);
              const ys = defaultFormatMeasureValue('y', raw.y, nullBandLabel);
              return `${xs}, ${ys}`;
            },
          },
          caption: {
            display: (context) =>
              pointLabelDisplay(context, options.showPointLabels) ? 'auto' : false,
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
          label: (ctx) => scatterTooltipLabel(ctx, nullBandLabel, defaultFormatMeasureValue),
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
          callback: xTickCallback,
        },
        title: {
          display: Boolean(options.xAxisLabel),
          text: options.xAxisLabel,
        },
        reverse: options.reverseXAxis,
        min: mergeAxisMin(
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
          callback: yTickCallback,
        },
        title: {
          display: Boolean(options.yAxisLabel),
          text: options.yAxisLabel,
        },
        min: mergeAxisMin(
          options.yAxisRangeMin,
          applyNullY ? nullBand?.computedYAxisMin : undefined,
        ),
        max: options.yAxisRangeMax,
      },
    },
  };

  return mergician(getChartjsAxisOptions(), newOptions);
};
