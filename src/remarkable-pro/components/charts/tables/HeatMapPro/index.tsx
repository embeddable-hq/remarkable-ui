import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { HeatMap, HeatMapProps } from '../../../../../remarkable-ui';
import { useRef } from 'react';
import { useFillGaps } from '../../charts.newFillGaps.hooks';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

type HeatMapProProps = {
  title: string;
  description: string;
  results: DataResponse;
  measure: Measure;
  rowDimension: Dimension;
  columnDimension: Dimension;
  displayNullAs?: string;
  columnWidth?: number;
  firstColumnWidth?: number;
  maxColor: string;
  midColor: string;
  minColor: string;
  showValues?: boolean;
  minThreshold?: number;
  maxThreshold?: number;
};

export const getHeatMeasure = (
  props: { measure: Measure; displayNullAs?: string },
  theme: Theme,
): HeatMapProps<any>['measure'] => {
  const themeFormatter = getThemeFormatter(theme);

  return {
    key: props.measure.name,
    label: themeFormatter.dimensionOrMeasureTitle(props.measure),
    format: (value) => {
      return themeFormatter.data(props.measure, value);
    },
    formatRaw: (value) => {
      const test = value == null ? props.displayNullAs : value;
      const newValue = Number(test);
      return Number.isNaN(newValue) ? test : newValue;
    },
  };
};

export const getHeatDimension = (
  props: { dimension: Dimension },
  theme: Theme,
): HeatMapProps<any>['rowDimension' | 'columnDimension'] => {
  const themeFormatter = getThemeFormatter(theme);

  return {
    key: props.dimension.name,
    label: themeFormatter.dimensionOrMeasureTitle(props.dimension),
    format: (value: string) => themeFormatter.data(props.dimension, value),
  };
};

const HeatMapPro = (props: HeatMapProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const { description, title } = resolveI18nProps(props);
  const {
    measure,
    rowDimension,
    columnDimension,
    maxColor,
    midColor,
    minColor,
    displayNullAs,
    columnWidth,
    firstColumnWidth,
    showValues,
    minThreshold,
    maxThreshold,
  } = props;

  // Fill gaps for the column dimension
  const resultsColumnDimensionFillGaps = useFillGaps({
    results: props.results,
    dimension: columnDimension,
  });

  // Fill gaps for the row dimension
  const results = useFillGaps({
    results: resultsColumnDimensionFillGaps,
    dimension: rowDimension,
  });

  const cardContentRef = useRef<HTMLDivElement>(null);

  const pivotMeasures = getHeatMeasure({ measure, displayNullAs }, theme);
  const pivotRowDimension = getHeatDimension({ dimension: rowDimension }, theme);
  const pivotColumnDimension = getHeatDimension({ dimension: columnDimension }, theme);

  return (
    <ChartCard
      ref={cardContentRef}
      title={title}
      subtitle={description}
      data={props.results}
      dimensionsAndMeasures={[rowDimension, columnDimension, measure]}
      errorMessage={results?.error}
    >
      <HeatMap
        data={results.data ?? []}
        measure={pivotMeasures}
        rowDimension={pivotRowDimension}
        columnDimension={pivotColumnDimension}
        maxColor={maxColor}
        midColor={midColor}
        minColor={minColor}
        showValues={showValues}
        minThreshold={minThreshold}
        maxThreshold={maxThreshold}
        columnWidth={columnWidth}
        firstColumnWidth={firstColumnWidth}
      />
    </ChartCard>
  );
};

export default HeatMapPro;
