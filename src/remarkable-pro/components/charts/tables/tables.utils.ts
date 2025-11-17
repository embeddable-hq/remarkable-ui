import { DataResponse, Dimension, DimensionOrMeasure } from '@embeddable.com/core';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { CssSize } from '../../../../remarkable-ui/types/css.types';
import { Theme } from '../../../theme/theme.types';
import {
  getStyleNumber,
  TableHeaderAlign,
  TableHeaderItem,
  TableHeaderItemAlign,
} from '../../../../remarkable-ui';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const getTableHeaderAlign = (dimOrMeas: DimensionOrMeasure): TableHeaderItemAlign => {
  const subInputAlign = dimOrMeas.inputs?.align;

  if (subInputAlign) return subInputAlign;

  // Get width by native type
  switch (dimOrMeas.nativeType) {
    case 'number':
    case 'boolean':
    case 'time':
      return TableHeaderAlign.RIGHT;
    default:
      return TableHeaderAlign.LEFT;
  }
};

export const getTableHeaderMinWidth = (dimOrMeas: DimensionOrMeasure): CssSize => {
  const subInputWidth = dimOrMeas.inputs?.width;

  if (subInputWidth) return subInputWidth;

  // Get width by native type
  switch (dimOrMeas.nativeType) {
    case 'string':
      return getStyleNumber('--TEMP-table-min-width-string_R' as any, '8.75rem') as number;
    case 'number':
      return getStyleNumber('--TEMP-table-min-width-number_R' as any, '5.625rem') as number;
    case 'time':
      return getStyleNumber('--TEMP-table-min-width-time_R' as any, '8.75rem') as number;
    case 'boolean':
    default:
      return getStyleNumber('--TEMP-table-min-width-boolean_R' as any, '5.625rem') as number;
  }
};

export const getTableHeaders = (
  props: {
    dimensionsAndMeasures: DimensionOrMeasure[];
    displayNullAs?: string;
  },
  theme: Theme,
): TableHeaderItem<any>[] => {
  const themeFormatter = getThemeFormatter(theme);
  return props.dimensionsAndMeasures.map((dimOrMeas) => ({
    id: dimOrMeas.name,
    title: themeFormatter.dimensionOrMeasureTitle(dimOrMeas),
    accessor: (row: any) => {
      if (row[dimOrMeas.name] == null) {
        return props.displayNullAs ?? '';
      }
      return themeFormatter.data(dimOrMeas, row[dimOrMeas.name]);
    },
    minWidth: getTableHeaderMinWidth(dimOrMeas),
    align: getTableHeaderAlign(dimOrMeas),
  }));
};

export const getTableRows = (props: { clickDimension?: Dimension; rows: DataResponse['data'] }) => {
  if (!props.rows || props.rows.length === 0) {
    return [];
  }

  const clickDimensionName = props.clickDimension?.name;

  if (!clickDimensionName || Object.keys(props.rows[0]!).includes(clickDimensionName)) {
    return props.rows;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return props.rows.map(({ [clickDimensionName]: _, ...row }) => ({
    ...row,
  }));
};
