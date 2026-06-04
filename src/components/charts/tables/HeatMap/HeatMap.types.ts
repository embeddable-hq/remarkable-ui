export type HeatMapPropsDimension<T> = {
  key: Extract<keyof T, string>;
  label: string;
  format?: (value: string) => string;
};

export type HeatMapPropsMeasure<T> = {
  key: Extract<keyof T, string>;
  label: string;
  format?: (value: number) => string;
};

export type HeatMapPropsThreshold = string | number | `${number}%` | undefined;

export type HeatMapCellClickArg = {
  /** Raw string value of the row dimension for the clicked cell. */
  rowDimensionValue: string;
  /** Raw string value of the column dimension for the clicked cell. */
  columnDimensionValue: string;
};

export type HeatMapProps<T extends Record<string, unknown>> = {
  data: T[];
  measure: HeatMapPropsMeasure<T>;
  rowDimension: HeatMapPropsDimension<T>;
  columnDimension: HeatMapPropsDimension<T>;
  showValues?: boolean;
  className?: string;
  displayNullAs?: string | number;

  /** Color thresholds — number = raw value, "NN%" = percentage of [min..max]. */
  minThreshold?: HeatMapPropsThreshold;
  maxThreshold?: HeatMapPropsThreshold;

  minColor?: string;
  midColor?: string;
  maxColor?: string;
  columnWidth?: number;
  firstColumnWidth?: number;
  missingCellColor?: string;

  /** Optional click handler — called when a data cell is clicked. */
  onCellClick?: (args: HeatMapCellClickArg) => void;
};
