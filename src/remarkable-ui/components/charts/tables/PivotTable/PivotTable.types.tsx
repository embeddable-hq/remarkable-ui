/* eslint-disable @typescript-eslint/no-explicit-any */

import { ReactElement } from 'react';

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

export type PivotTableProps<T> = {
  data: T[];
  measures: PivotTablePropsMeasure<T>[];
  rowDimension: PivotTablePropsRowDimension<T>;
  columnDimension: PivotTablePropsColumnDimension<T>;
  progressive?: boolean;
  batchSize?: number;
  batchDelayMs?: number;
  rowTotalsFor?: Array<Extract<keyof T, string>>;
  columnTotalsFor?: Array<Extract<keyof T, string>>;
  showColumnPercentages?: boolean;
  totalLabel?: string;
  percentageDecimalPlaces?: number;
  columnWidth?: number;
  firstColumnWidth?: number;
  className?: string;
};
