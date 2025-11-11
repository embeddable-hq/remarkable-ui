import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { HeatMap, HeatMapProps } from '../../../../../remarkable-ui';
import { useRef } from 'react';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { useFillGaps } from '../../charts.fillGaps.hooks';

/* eslint-disable @typescript-eslint/no-explicit-any */

type HeatMapProProps = {
  columnDimension: Dimension;
  columnMinWidth?: number;
  description: string;
  displayNullAs?: string;
  firstColumnMinWidth?: number;
  maxColor: string;
  maxThreshold?: number;
  measure: Measure;
  midColor: string;
  minColor: string;
  minThreshold?: number;
  results: DataResponse;
  rowDimension: Dimension;
  showValues?: boolean;
  title: string;
};

export const getHeatMeasure = (
  props: { measure: Measure },
  theme: Theme,
): HeatMapProps<any>['measure'] => {
  const themeFormatter = getThemeFormatter(theme);

  return {
    key: props.measure.name,
    label: themeFormatter.dimensionOrMeasureTitle(props.measure),
    format: (value) => {
      return themeFormatter.data(props.measure, value);
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
    columnMinWidth,
    firstColumnMinWidth,
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

  const pivotMeasures = getHeatMeasure({ measure }, theme);
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
        columnMinWidth={columnMinWidth}
        firstColumnMinWidth={firstColumnMinWidth}
        displayNullAs={displayNullAs}
      />
    </ChartCard>
  );
};

export default HeatMapPro;
