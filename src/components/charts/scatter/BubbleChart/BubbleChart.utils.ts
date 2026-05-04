import { ChartData, ChartDataset, ChartOptions, TooltipItem } from 'chart.js';
import { mergician } from 'mergician';
import {
  BubbleChartConfigurationProps,
  BubbleChartInputPoint,
  ScatterChartInputPoint,
} from '../scatter.types';
import type { ScatterNullBandResult } from '../scatter.nullBand.utils';
import { getStyleNumber } from '../../../../styles/styles.utils';
import {
  filterNumericScatterData,
  getScatterDataWithNullBand,
  getScatterChartOptions,
  isMeasureMissing,
  ScatterDatasetWithOriginal,
} from '../scatter.utils';

const numberFormat = new Intl.NumberFormat();

export type BubbleDatasetWithOriginal = ChartDataset<
  'bubble',
  { x: number; y: number; r: number }[]
> & {
  originalData?: BubbleChartInputPoint[];
  bubbleSizes?: number[];
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

const formatValue = (value: number | null | undefined, nullLabel: string | undefined): string => {
  if (isMeasureMissing(value)) return nullLabel ?? 'No value';
  return numberFormat.format(value as number);
};

const getBubbleTooltipLabel = (
  ctx: TooltipItem<'bubble'>,
  nullLabel: string | undefined,
): string => {
  const ds = ctx.dataset as BubbleDatasetWithOriginal;
  const orig = ds.originalData?.[ctx.dataIndex];
  const prefix = ds.label ? `${ds.label}: ` : '';
  const x = orig ? formatValue(orig.x, nullLabel) : String(ctx.parsed.x);
  const y = orig ? formatValue(orig.y, nullLabel) : String(ctx.parsed.y);
  const size = formatValue(orig?.size, nullLabel);
  return `${prefix}(${x}, ${y}, ${size})`;
};

export const getBubbleChartData = (
  data: ChartData<'bubble', BubbleChartInputPoint[]>,
  props: BubbleChartConfigurationProps & { nullBand: ScatterNullBandResult | null },
): ChartData<'bubble'> => {
  const { nullBand, showLogarithmicScale, bubbleRadiusMin, bubbleRadiusMax } = props;
  const defaultOpacity = getStyleNumber('--em-bubblechart-point-opacity', '0.7');
  const nullOpacity = getStyleNumber('--em-bubblechart-point-opacity--null', '0.3');
  const bubbleMinRadiusPx =
    bubbleRadiusMin ?? getStyleNumber('--em-bubblechart-point-radius--min', '5');
  const bubbleMaxRadiusPx =
    bubbleRadiusMax ?? getStyleNumber('--em-bubblechart-point-radius--max', '40');

  const bubbleDataAsScatter = (showLogarithmicScale
    ? filterNumericScatterData(data as unknown as ChartData<'scatter', ScatterChartInputPoint[]>)
    : data) as unknown as ChartData<'scatter', ScatterChartInputPoint[]>;

  const scatterDataWithNullBand = getScatterDataWithNullBand(bubbleDataAsScatter, {
    nullBand,
    supportsNullMeasures: !showLogarithmicScale,
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
      const bubbleSizes = (originalBubbleData ?? []).map((point) =>
        computeBubbleRadius(point.size, maxBubbleSize, bubbleMinRadiusPx, bubbleMaxRadiusPx),
      );
      return {
        ...dataset,
        data: (dataset.data as { x: number; y: number }[]).map((pt, i) => ({
          ...pt,
          r: bubbleSizes[i],
        })),
        bubbleSizes,
      } as unknown as BubbleDatasetWithOriginal;
    }),
  } as unknown as ChartData<'bubble'>;
};

export const getBubbleChartOptions = (
  config: BubbleChartConfigurationProps & { nullBand?: ScatterNullBandResult | null },
): Partial<ChartOptions<'bubble'>> => {
  const { nullBandLabel, bubbleRadiusMin } = config;
  const bubbleMinRadiusPx =
    bubbleRadiusMin ?? getStyleNumber('--em-bubblechart-point-radius--min', '5');
  const bubbleHoverScale = getStyleNumber('--em-bubblechart-point-radius--hover--scale', '1.2');
  const bubbleBorderWidth = getStyleNumber('--em-bubblechart-point-border-width', '1');

  const scatterBaseOptions = getScatterChartOptions(config) as unknown as Partial<
    ChartOptions<'bubble'>
  >;

  return mergician(scatterBaseOptions, {
    scales: {
      x: { grace: 0 },
      y: { grace: 0 },
    },
    elements: {
      point: {
        borderWidth: bubbleBorderWidth,
        hoverRadius: ((ctx: { dataIndex: number; dataset: BubbleDatasetWithOriginal }) => {
          const r = ctx.dataset.bubbleSizes?.[ctx.dataIndex] ?? bubbleMinRadiusPx;
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
