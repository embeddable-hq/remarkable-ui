import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { getObjectStableKey } from '../../../../utils.ts/object.utils';
import { getStyleNumber } from '../../../../../remarkable-ui';
import { Theme } from '../../../../theme/theme.types';
import { getColor } from '../../../../theme/styles/styles.utils';
import { chartContrastColors } from '../../../../../remarkable-ui/charts/charts.constants';
import { i18n } from '../../../../theme/i18n/i18n';
import {
  chartjsAxisOptionsScalesTicksDefault,
  chartjsAxisOptionsScalesTitle,
} from '../../../../../remarkable-ui/charts/chartjs.cartesian.constants';
import { mergician } from 'mergician';
import { isColorValid, setColorAlpha } from '../../../../utils.ts/color.utils';

const AXIS_ID_MAIN = 'mainAxis';
const AXIS_ID_COMPARISON = 'comparisonAxis';

const getLineChartComparisonDataset = (
  props: {
    data: DataResponse['data'];
    measure: Measure;
    dimension: Dimension;
    labels?: string[];
    hasMinMaxYAxisRange: boolean;
    isPreviousPeriod?: boolean;
    index: number;
  },
  theme: Theme,
): ChartData<'line'>['datasets'][number] => {
  const { data, measure, dimension, index, isPreviousPeriod, hasMinMaxYAxisRange, labels } = props;

  const datasetLabels = data?.map((item) => item[dimension.name]);

  const zeroFill = Boolean(measure.inputs?.['connectGaps']);

  const processedData = labels
    ? labels.map((label) => {
        const found = data?.find((item) => item[dimension.name] === label);
        return found?.[measure.name] ?? (zeroFill ? 0 : null);
      })
    : data?.map((item) => item[measure.name] ?? (zeroFill ? 0 : null));

  const themeFormatter = getThemeFormatter(theme);
  const themeKey = getObjectStableKey(theme);

  const isLineDashed = Boolean(
    measure.inputs?.[isPreviousPeriod ? 'previousLineDashed' : 'lineDashed'],
  );

  const lineColorTemp = measure.inputs?.[isPreviousPeriod ? 'previousLineColor' : 'lineColor'];
  const lineColor = isColorValid(lineColorTemp)
    ? lineColorTemp
    : getColor(
        `${themeKey}.charts.backgroundColors`,
        measure.name,
        theme.charts.backgroundColors ?? chartContrastColors,
        index,
      );

  const dataset = {
    xAxisID: isPreviousPeriod ? AXIS_ID_COMPARISON : AXIS_ID_MAIN,
    labels: datasetLabels,
    label:
      (isPreviousPeriod ? `${i18n.t('common.compared')} ` : '') +
      themeFormatter.dimensionOrMeasureTitle(measure),
    data: processedData,
    backgroundColor: setColorAlpha(
      lineColor,
      getStyleNumber('--em-line-chart-line-fill-opacity') as number,
    ),
    pointBackgroundColor: lineColor,
    borderDash: isLineDashed
      ? [
          getStyleNumber('--em-line-chart-line-dash-length'),
          getStyleNumber('--em-line-chart-line-gap-length'),
        ]
      : undefined,
    borderColor: lineColor,
    fill: measure.inputs?.['fillUnderLine'],
    clip: hasMinMaxYAxisRange,
  } as ChartData<'line'>['datasets'][number];

  return dataset;
};

export const getLineChartComparisonProData = (
  props: {
    data: DataResponse['data'];
    dataComparison: DataResponse['data'] | undefined;
    dimension: Dimension;
    measures: Measure[];
    hasMinMaxYAxisRange: boolean;
  },
  theme: Theme,
): ChartData<'line'> => {
  if (!props.data) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const { data, dataComparison, dimension, measures, hasMinMaxYAxisRange } = props;

  // Get all the available labels from both datasets if the dimension is not a time type (E.g. join United States with United Kindom and Germany)
  const isTimeDimension = dimension.nativeType === 'time';
  const labels = isTimeDimension
    ? undefined
    : Array.from(
        new Set([
          ...data.map((item) => item[dimension.name]),
          ...(dataComparison?.map((item) => item[dimension.name]) ?? []),
        ]),
      );

  const originalDatasets = measures.map((measure, index) =>
    getLineChartComparisonDataset(
      {
        data,
        measure,
        dimension,
        labels,
        hasMinMaxYAxisRange,
        index,
      },
      theme,
    ),
  );

  const comparisonDatasets = measures.map((measure, index) =>
    getLineChartComparisonDataset(
      {
        data: dataComparison,
        measure,
        dimension,
        labels,
        hasMinMaxYAxisRange,
        index,
        isPreviousPeriod: true,
      },
      theme,
    ),
  );

  return {
    labels: isTimeDimension ? data.map((item) => item[dimension.name]) : labels,
    datasets: [...originalDatasets, ...comparisonDatasets],
  };
};

type LineChartComparisonProOptionsProps = {
  dimension: Dimension;
  measures: Measure[];
  data: ChartData<'line'>;
  xAxisLabel?: string;
  showComparisonAxis: boolean;
};

const getLineChartComparisonNonTimeOptions = (
  options: LineChartComparisonProOptionsProps,
  theme: Theme,
): ChartOptions<'line'> => {
  const { dimension, data, measures, xAxisLabel } = options;
  const themeFormatter = getThemeFormatter(theme);

  const lineChartOptions: ChartOptions<'line'> = {
    plugins: {
      datalabels: {
        labels: {
          value: {
            formatter: (value: string | number, context) => {
              const measure = measures[context.datasetIndex % measures.length]!;
              return themeFormatter.data(measure, value);
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            if (!context[0]) return '';

            return themeFormatter.data(dimension, context[0].label);
          },
          label: (context) => {
            const measure = measures[context.datasetIndex % measures.length]!;
            const raw = context.raw as number;
            return `${context.dataset.label}: ${themeFormatter.data(measure, raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        display: false,
      },
      [AXIS_ID_MAIN]: {
        title: {
          ...chartjsAxisOptionsScalesTitle,
          text: xAxisLabel,
          display: Boolean(xAxisLabel),
        },
        grid: { display: false },
        ticks: {
          ...chartjsAxisOptionsScalesTicksDefault,
          callback(index) {
            return themeFormatter.data(dimension, data.labels?.[index as number]);
          },
        },
      },
      [AXIS_ID_COMPARISON]: {
        display: false,
      },
      y: {
        ticks: {
          callback: (value) => {
            return themeFormatter.data(measures[0]!, value);
          },
        },
      },
    },
  };

  return lineChartOptions;
};

const getLineChartComparisonTimeOptions = (
  options: {
    dimension: Dimension;
    measures: Measure[];
    data: ChartData<'line'>;
    xAxisLabel?: string;
    showComparisonAxis: boolean;
  },
  theme: Theme,
): ChartOptions<'line'> => {
  const { dimension, data, measures, xAxisLabel, showComparisonAxis } = options;
  const themeFormatter = getThemeFormatter(theme);

  const mainDimensionLabels: string[] =
    (data.datasets.find((ds) => ds.xAxisID === AXIS_ID_MAIN) as { labels?: string[] })?.labels ??
    [];
  const comparisonDimensionLabels: string[] =
    (data.datasets.find((ds) => ds.xAxisID === AXIS_ID_COMPARISON) as { labels?: string[] })
      ?.labels ?? [];

  const lineChartOptions: ChartOptions<'line'> = {
    plugins: {
      legend: {
        labels: {
          filter: (legendItem, chartData) => {
            if (!legendItem) return false;
            const dataset = chartData.datasets[legendItem.datasetIndex!]!;
            // Only show legend if dataset has at least one data point
            return Array.isArray(dataset.data) && dataset.data.length > 0;
          },
        },
      },
      datalabels: {
        labels: {
          value: {
            formatter: (value: string | number, context) => {
              const measure = measures[context.datasetIndex % measures.length]!;
              return themeFormatter.data(measure, value);
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const dataIndex = context[0]?.dataIndex;

            if (dataIndex === undefined) return '';

            const main =
              mainDimensionLabels[dataIndex] &&
              themeFormatter.data(dimension, mainDimensionLabels[dataIndex]);
            const comparison =
              comparisonDimensionLabels[dataIndex] &&
              themeFormatter.data(dimension, comparisonDimensionLabels[dataIndex]);

            return `${main ?? '-'} vs ${comparison ?? '-'}`;
          },
          label: (context) => {
            const measure = measures[context.datasetIndex % measures.length]!;
            const raw = context.raw as number;
            return `${context.dataset.label}: ${themeFormatter.data(measure, raw)}`;
          },
        },
      },
    },
    scales: {
      x: { display: false },
      [AXIS_ID_MAIN]: {
        title: {
          ...chartjsAxisOptionsScalesTitle,
          text: xAxisLabel,
          display: Boolean(
            (!showComparisonAxis || comparisonDimensionLabels.length === 0) && xAxisLabel,
          ),
        },
        grid: { display: false },
        ticks: {
          ...chartjsAxisOptionsScalesTicksDefault,
          callback: (index) => {
            return themeFormatter.data(dimension, mainDimensionLabels[Number(index)]);
          },
        },
      },
      [AXIS_ID_COMPARISON]: {
        title: {
          ...chartjsAxisOptionsScalesTitle,
          text: xAxisLabel,
          display: Boolean(xAxisLabel),
        },
        grid: { display: false },
        display: showComparisonAxis && comparisonDimensionLabels.length > 0,
        ticks: {
          ...chartjsAxisOptionsScalesTicksDefault,
          callback: (index) => {
            if (comparisonDimensionLabels.length === 0) {
              return '';
            }
            return themeFormatter.data(dimension, comparisonDimensionLabels[Number(index)]);
          },
        },
      },
      y: {
        ticks: {
          callback: (value) => {
            return themeFormatter.data(measures[0]!, value);
          },
        },
      },
    },
  };

  return lineChartOptions;
};

export const getLineChartComparisonProOptions = (
  options: LineChartComparisonProOptionsProps,
  theme: Theme,
): ChartOptions<'line'> => {
  const getOptions =
    options.dimension.nativeType === 'time'
      ? getLineChartComparisonTimeOptions
      : getLineChartComparisonNonTimeOptions;
  return mergician(
    getOptions(options, theme),
    theme.charts?.lineChartComparisonDefaultPro?.options || {},
  );
};
