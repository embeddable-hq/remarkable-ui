import { Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../../theme/theme.types';
import { PivotTableProps } from '../../../../../remarkable-ui';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

export const getPivotMeasures = (
  props: { measures: Measure[]; displayNullAs?: string },
  theme: Theme,
): PivotTableProps<any>['measures'] => {
  const themeFormatter = getThemeFormatter(theme);

  return props.measures.map((measure) => {
    return {
      key: measure.name,
      label: themeFormatter.dimensionOrMeasureTitle(measure),
      showAsPercentage: Boolean(measure.inputs?.showAsPercentage),
      percentageDecimalPlaces: measure.inputs?.decimalPlaces ?? 1,
      accessor: (row) => {
        const value = row[measure.name];

        return value == null
          ? props.displayNullAs
          : themeFormatter.data(measure, row[measure.name]);
      },
    };
  });
};

export const getPivotDimension = (
  props: { dimension: Dimension },
  theme: Theme,
): PivotTableProps<any>['rowDimension' | 'columnDimension'] => {
  const themeFormatter = getThemeFormatter(theme);

  return {
    key: props.dimension.name,
    label: themeFormatter.dimensionOrMeasureTitle(props.dimension),
    formatValue: (value: string) => themeFormatter.data(props.dimension, value),
  };
};

export const getPivotColumnTotalsFor = (
  measures: Measure[],
): PivotTableProps<any>['columnTotalsFor'] | undefined => {
  return measures.filter((m) => m.inputs?.showColumnTotal).map((m) => m.name);
};

export const getPivotRowTotalsFor = (
  measures: Measure[],
): PivotTableProps<any>['rowTotalsFor'] | undefined => {
  return measures.filter((m) => m.inputs?.showRowTotal).map((m) => m.name);
};
