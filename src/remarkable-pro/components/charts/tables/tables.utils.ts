import { DimensionOrMeasure } from '@embeddable.com/core';
import { getThemeFormatter } from '../../../theme/formatter/formatter.utils';
import { CssSize } from '../../../../remarkable-ui/types/css.types';
import { Theme } from '../../../theme/theme.types';
import { getStyleNumber, TableHeaderItem } from '../../../../remarkable-ui';

export const getTableHeaderAlign = (dimOrMeas: DimensionOrMeasure): 'left' | 'center' | 'right' => {
  const subInputAlign = dimOrMeas.inputs?.align;

  if (subInputAlign) return subInputAlign;

  // Get width by native type
  switch (dimOrMeas.nativeType) {
    case 'number':
    case 'boolean':
    case 'time':
      return 'right';
    default:
      return 'left';
  }
};

export const getTableHeaderMinWidth = (dimOrMeas: DimensionOrMeasure): CssSize => {
  const subInputWidth = dimOrMeas.inputs?.width;

  if (subInputWidth) return subInputWidth;

  // Get width by native type
  switch (dimOrMeas.nativeType) {
    case 'string':
      return getStyleNumber('--em-table-min-width-string_R' as any, '8.75rem') as number;
    case 'number':
      return getStyleNumber('--em-table-min-width-number_R' as any, '5.625rem') as number;
    case 'time':
      return getStyleNumber('--em-table-min-width-time_R' as any, '8.75rem') as number;
    case 'boolean':
    default:
      return getStyleNumber('--em-table-min-width-boolean_R' as any, '5.625rem') as number;
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
