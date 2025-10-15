import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../../theme/theme.types';
import { ChartData, ChartOptions } from 'chart.js';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { mergician } from 'mergician';
import { getObjectStableKey } from '../../../../utils.ts/object.utils';
import { getColor } from '../../../../theme/styles/styles.utils';
import { chartContrastColors } from '../../../../../remarkable-ui/charts/charts.constants';
import { i18n } from '../../../../theme/i18n/i18n';
import { setColorAlpha } from '../../../../utils.ts/color.utils';
import { getStyleNumber } from '../../../../../remarkable-ui';

export const getLineChartGroupedProData = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    groupDimension: Dimension;
    measure: Measure;
  },
  theme: Theme,
): ChartData<'line'> => {
  const themeFormatter = getThemeFormatter(theme);
  const { data = [], dimension, groupDimension, measure } = props;

  const axis = [...new Set(data.map((d) => d[dimension.name]).filter(Boolean))].sort();

  console.log('data line', data);
  const groupBy = [...new Set(data.map((d) => d[groupDimension.name]))].filter(Boolean);

  const themeKey = getObjectStableKey(theme);

  const datasets = groupBy.map((groupByItem, index) => {
    const backgroundColor = getColor(
      `${themeKey}.charts.backgroundColors`,
      `${groupDimension.name}.${groupByItem}`,
      theme.charts.backgroundColors ?? chartContrastColors,
      index,
    );

    const borderColor = getColor(
      `${themeKey}.charts.borderColors`,
      `${groupDimension.name}.${groupByItem}`,
      theme.charts.borderColors ?? chartContrastColors,
      index,
    );

    return {
      label: themeFormatter.data(groupDimension, groupByItem),
      rawLabel: groupByItem,
      backgroundColor: setColorAlpha(
        backgroundColor,
        getStyleNumber('--em-line-chart-line-fill-opacity') as number,
      ),
      pointBackgroundColor: backgroundColor,
      fill: measure.inputs?.['fillUnderLine'],
      borderColor,
      data: axis.map((axisItem) => {
        const record = data.find(
          (d) => d[groupDimension.name] === groupByItem && d[dimension.name] === axisItem,
        );
        return record?.[measure.name] ?? (measure.inputs?.['connectGaps'] ? 0 : null);
      }),
    };
  });

  return {
    labels: axis,
    datasets,
  };
};

export const getLineChartGroupedProData2 = (
  props: {
    data: DataResponse['data'];
    dimension: Dimension;
    groupDimension: Dimension;
    measure: Measure;
    maxLegendItems: number;
  },
  theme: Theme,
): ChartData<'line'> => {
  const themeFormatter = getThemeFormatter(theme);
  const { data = [], dimension, groupDimension, measure, maxLegendItems } = props;

  const axis = [...new Set(data.map((d) => d[dimension.name]).filter(Boolean))].sort();
  const groupBy = [...new Set(data.map((d) => d[groupDimension.name]))];
  const themeKey = getObjectStableKey(theme);
  const zeroFill = Boolean(measure.inputs?.['connectGaps']);

  // Calculate total per group
  const groupTotals = groupBy.map((group) => {
    const total = data
      .filter((d) => d[groupDimension.name] === group)
      .reduce((sum, d) => sum + Number(d[measure.name] || 0), 0);
    return { group, total };
  });

  // Sort by total descending and split top groups vs others
  const sortedGroups = groupTotals.sort((a, b) => b.total - a.total);
  const topGroups = sortedGroups.slice(0, maxLegendItems).map((g) => g.group);
  const otherGroups = sortedGroups.slice(maxLegendItems).map((g) => g.group);

  // Generate datasets for top groups
  const datasets = topGroups.map((groupByItem, index) => {
    const backgroundColor = getColor(
      `${themeKey}.charts.backgroundColors`,
      `${groupDimension.name}.${groupByItem}`,
      theme.charts.backgroundColors ?? chartContrastColors,
      index,
    );

    const borderColor = getColor(
      `${themeKey}.charts.borderColors`,
      `${groupDimension.name}.${groupByItem}`,
      theme.charts.borderColors ?? chartContrastColors,
      index,
    );

    return {
      label: themeFormatter.data(groupDimension, groupByItem),
      backgroundColor: setColorAlpha(
        backgroundColor,
        getStyleNumber('--em-line-chart-line-fill-opacity') as number,
      ),
      pointBackgroundColor: backgroundColor,
      borderColor,
      fill: measure.inputs?.['fillUnderLine'],
      data: axis.map((axisItem) => {
        const record = data.find(
          (d) => d[groupDimension.name] === groupByItem && d[dimension.name] === axisItem,
        );
        return record?.[measure.name] ?? (zeroFill ? 0 : null);
      }),
    };
  });

  // Aggregate “Others” dataset if needed
  if (otherGroups.length > 0) {
    const othersData = axis.map((axisItem) => {
      const sum = data
        .filter(
          (d) => otherGroups.includes(d[groupDimension.name]) && d[dimension.name] === axisItem,
        )
        .reduce((total, d) => total + Number(d[measure.name] || 0), 0);

      // Respect zeroFill logic
      return sum > 0 || zeroFill ? sum : null;
    });

    const otherIndex = topGroups.length - 1;

    const backgroundColor = getColor(
      `${themeKey}.charts.backgroundColors`,
      `${groupDimension.name}.Other`,
      theme.charts.backgroundColors ?? chartContrastColors,
      otherIndex,
    );

    const borderColor = getColor(
      `${themeKey}.charts.borderColors`,
      `${groupDimension.name}.Other`,
      theme.charts.borderColors ?? chartContrastColors,
      otherIndex,
    );

    datasets.push({
      label: i18n.t('common.other'),
      backgroundColor: setColorAlpha(
        backgroundColor,
        getStyleNumber('--em-line-chart-line-fill-opacity') as number,
      ),
      pointBackgroundColor: backgroundColor,
      borderColor,
      fill: measure.inputs?.['fillUnderLine'],
      data: othersData,
    });
  }

  return {
    labels: axis,
    datasets,
  };
};
export const getLineChartGroupedProOptions = (
  options: { dimension: Dimension; measure: Measure; data: ChartData<'line'> },
  theme: Theme,
): ChartOptions<'line'> => {
  const { dimension, data, measure } = options;
  const themeFormatter = getThemeFormatter(theme);

  const lineChartOptions: ChartOptions<'line'> = {
    plugins: {
      datalabels: {
        labels: {
          value: {
            formatter: (value: string | number) => {
              return themeFormatter.data(measure, value);
            },
          },
        },
      },
      tooltip: {
        callbacks: {
          title: (context) => {
            const label = context[0]?.label;
            return themeFormatter.data(dimension, label);
          },
          label: (context) => {
            const raw = context.raw as number;
            return `${context.dataset.label}: ${themeFormatter.data(measure, raw)}`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          callback: (value) => {
            if (!data || !data.labels) return undefined;

            const label = data.labels[Number(value)] as string;
            return themeFormatter.data(dimension, label);
          },
        },
      },
      y: {
        ticks: {
          callback: (value) => {
            return themeFormatter.data(measure, value);
          },
        },
      },
    },
  };

  return mergician(lineChartOptions, theme.charts?.lineChartGroupedPro?.options || {});
};
