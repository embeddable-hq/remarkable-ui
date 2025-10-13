import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { getObjectStableKey } from '../../../../utils.ts/object.utils';
import { colorWithOpacity, getStyleNumber, isValidColor } from '../../../../../remarkable-ui';
import { Theme } from '../../../../theme/theme.types';
import { getColor } from '../../../../theme/styles/styles.utils';
import { chartContrastColors } from '../../../../../remarkable-ui/charts/charts.constants';
import { i18n } from '../../../../theme/i18n/i18n';
import {
  chartjsAxisOptionsScalesTicksDefault,
  chartjsAxisOptionsScalesTitle,
} from '../../../../../remarkable-ui/charts/chartjs.cartesian.constants';
import { mergician } from 'mergician';

const AXIS_ID_MAIN = 'mainAxis';
const AXIS_ID_COMPARISON = 'comparisonAxis';

const getDataset = (
  props: {
    data: DataResponse['data'];
    measure: Measure;
    dimension: Dimension;
    labels?: string[];
    index: number;
    isPreviousPeriod?: boolean;
  },
  theme: Theme,
): ChartData<'line'>['datasets'][number] => {
  const { data, measure, dimension, index, isPreviousPeriod, labels: allLabels } = props;

  const labels = data?.map((item) => item[dimension.name]);

  const zeroFill = Boolean(measure.inputs?.['connectGaps']);

  const processedData = allLabels
    ? allLabels.map((label) => {
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
  const lineColor = isValidColor(lineColorTemp)
    ? lineColorTemp
    : getColor(
        `${themeKey}.charts.backgroundColors`,
        measure.name,
        theme.charts.backgroundColors ?? chartContrastColors,
        index,
      );

  const dataset = {
    xAxisID: isPreviousPeriod ? AXIS_ID_COMPARISON : AXIS_ID_MAIN,
    labels,
    label:
      (isPreviousPeriod ? `${i18n.t('common.compared')} ` : '') +
      themeFormatter.dimensionOrMeasureTitle(measure),
    data: processedData,
    backgroundColor: colorWithOpacity(lineColor),
    pointBackgroundColor: lineColor,
    borderDash: isLineDashed
      ? [
          getStyleNumber('--em-line-chart-line-dash-length'),
          getStyleNumber('--em-line-chart-line-gap-length'),
        ]
      : undefined,
    borderColor: lineColor,
    fill: measure.inputs?.['fillUnderLine'],
  } as ChartData<'line'>['datasets'][number];

  return dataset;
};

export const getLineChartComparisonProData = (
  props: {
    data: DataResponse['data'];
    dataComparison: DataResponse['data'] | undefined;
    dimension: Dimension;
    measures: Measure[];
  },
  theme: Theme,
): ChartData<'line'> => {
  if (!props.data) {
    return { labels: [], datasets: [{ data: [] }] };
  }

  const { data, dataComparison, dimension, measures } = props;

  // ✅ Only merge labels if NOT a time dimension
  const isTimeDimension = dimension.nativeType === 'time';
  const labels = isTimeDimension
    ? undefined
    : Array.from(
        new Set([
          ...data.map((item) => item[dimension.name]),
          ...(dataComparison?.map((item) => item[dimension.name]) ?? []),
        ]),
      );
  console.log('labels', labels);

  const originalDatasets = measures.map((measure, index) =>
    getDataset(
      {
        data,
        measure,
        dimension,
        labels,
        index,
      },
      theme,
    ),
  );

  const comparisonDatasets = measures.map((measure, index) =>
    getDataset(
      {
        data: dataComparison,
        measure,
        dimension,
        labels,
        index,
        isPreviousPeriod: true,
      },
      theme,
    ),
  );

  return {
    labels: isTimeDimension
      ? data.map((item) => {
          return item[dimension.name];
        })
      : labels,
    datasets: [...originalDatasets, ...comparisonDatasets],
  };
};

export const getLineChartComparisonProOptions = (
  options: {
    dimension: Dimension;
    measures: Measure[];
    data: ChartData<'line'>;
    xAxisLabel?: string;
    showComparisonAxis: boolean;
  },
  theme: Theme,
): ChartOptions<'line'> => {
  const getOptions =
    options.dimension.nativeType === 'time' ? getDoubleAxisOptions : getSingleAxisOptions;
  return mergician(
    getOptions(options, theme),
    theme.charts?.lineChartComparisonDefaultPro?.options || {},
  );
};

const getSingleAxisOptions = (
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
          // title: (context) => {
          //   const dataIndex = context[0]?.dataIndex;

          //   if (dataIndex === undefined) return '';

          //   const main =
          //     mainDimensionLabels[dataIndex] &&
          //     themeFormatter.data(dimension, mainDimensionLabels[dataIndex]);
          //   const comparison =
          //     comparisonDimensionLabels[dataIndex] &&
          //     themeFormatter.data(dimension, comparisonDimensionLabels[dataIndex]);

          //   return `${main ?? '-'} vs ${comparison ?? '-'}`;
          // },
          label: (context) => {
            const measure = measures[context.datasetIndex % measures.length]!;
            const raw = context.raw as number;
            return `${themeFormatter.data(dimension, context.dataset.label) || ''}: ${themeFormatter.data(measure, raw)}`;
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
          display: Boolean(xAxisLabel),
        },
        grid: { display: false },
        // ticks: {
        //   ...chartjsAxisOptionsScalesTicksDefault,
        //   callback: (index) => {
        //     return themeFormatter.data(dimension, mainDimensionLabels[Number(index)]);
        //   },
        // },
      },
      // [AXIS_ID_COMPARISON]: {
      //   title: {
      //     text: xAxisLabel,
      //     display: Boolean(xAxisLabel),
      //   },
      //   grid: { display: false },
      //   display: showComparisonAxis,
      //   ticks: {
      //     ...chartjsAxisOptionsScalesTicksDefault,
      //     callback: (index) => {
      //       if (comparisonDimensionLabels.length === 0) {
      //         return '';
      //       }
      //       return themeFormatter.data(dimension, comparisonDimensionLabels[Number(index)]);
      //     },
      //   },
      // },
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

const getDoubleAxisOptions = (
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
            return `${themeFormatter.data(dimension, context.dataset.label) || ''}: ${themeFormatter.data(measure, raw)}`;
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
