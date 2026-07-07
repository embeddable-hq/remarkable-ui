/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactElement } from 'react';

export const PivotAggregationType = {
  SUM: 'sum',
  MIN: 'min',
  MAX: 'max',
  AVERAGE: 'average',
} as const;

export type PivotAggregationType = (typeof PivotAggregationType)[keyof typeof PivotAggregationType];

/** @internal Used by the component to drive header/cell rendering in a consistent order. */
export type PivotAggregationConfig<T> = {
  type: PivotAggregationType;
  measureKeys: Array<Extract<keyof T, string>>;
};

export type PivotTablePropsMeasure<T> = {
  key: Extract<keyof T, string>;
  label: string;
  showAsPercentage?: boolean;
  percentageDecimalPlaces?: number;
  accessor?: (row: Record<string, any>) => any;
  cell?: (props: { value: any; className?: string }) => ReactElement<HTMLTableCellElement>;
};

export type PivotTablePropsRowDimension<T> = {
  key: Extract<keyof T, string>;
  label: string;
  formatValue?: (value: any) => any;
};

export type PivotTablePropsColumnDimension<T> = {
  key: Extract<keyof T, string>;
  label: string;
  formatValue?: (value: any) => any;
};

type MeasureKeys<T> = Array<Extract<keyof T, string>>;

export type PivotTableProps<T> = {
  data: T[];
  measures: PivotTablePropsMeasure<T>[];
  rowDimension: PivotTablePropsRowDimension<T>;
  columnDimension: PivotTablePropsColumnDimension<T>;
  progressive?: boolean;
  batchSize?: number;
  batchDelayMs?: number;
  rowSumFor?: MeasureKeys<T>;
  rowMinFor?: MeasureKeys<T>;
  rowMaxFor?: MeasureKeys<T>;
  rowAverageFor?: MeasureKeys<T>;
  columnSumFor?: MeasureKeys<T>;
  columnMinFor?: MeasureKeys<T>;
  columnMaxFor?: MeasureKeys<T>;
  columnAverageFor?: MeasureKeys<T>;
  sumLabel?: string;
  minLabel?: string;
  maxLabel?: string;
  averageLabel?: string;
  percentageDecimalPlaces?: number;
  columnWidth?: number;
  firstColumnWidth?: number;
  className?: string;
  expandableRows?: boolean;
  subRowsByRow?: Map<string, T[]>;
  loadingRows?: Set<string>;
  onRowExpand?: (rowKey: string) => void;
  subRowDimension?: PivotTablePropsRowDimension<T>;
};
