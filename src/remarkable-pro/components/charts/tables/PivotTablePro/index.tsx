import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18n, i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { PivotTable } from '../../../../../remarkable-ui';
import { useRef } from 'react';
import { useFillGaps } from '../../charts.fillGaps.hooks';
import { getPivotColumnTotalsFor, getPivotDimension, getPivotMeasures } from './PivotPro.utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

type PivotTableProProps = {
  title: string;
  description: string;
  results: DataResponse;
  measures: Measure[];
  rowDimension: Dimension;
  columnDimension: Dimension;
  showRowTotals?: boolean;
  displayNullAs?: string;
  columnWidth?: number;
  firstColumnWidth?: number;
};

const PivotTablePro = (props: PivotTableProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const { description, title } = resolveI18nProps(props);
  const {
    measures,
    rowDimension,
    columnDimension,
    showRowTotals,
    displayNullAs,
    columnWidth,
    firstColumnWidth,
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

  const pivotMeasures = getPivotMeasures({ measures, displayNullAs }, theme);
  const pivotRowDimension = getPivotDimension({ dimension: rowDimension }, theme);
  const pivotColumnDimension = getPivotDimension({ dimension: columnDimension }, theme);
  const pivotColumnTotalsFor = getPivotColumnTotalsFor({ measures });
  const pivotRowTotalsFor = showRowTotals ? measures.map((m) => m.name) : [];

  return (
    <ChartCard
      ref={cardContentRef}
      title={title}
      subtitle={description}
      data={props.results}
      dimensionsAndMeasures={[rowDimension, columnDimension, ...measures]}
      errorMessage={results?.error}
    >
      <PivotTable
        firstColumnWidth={firstColumnWidth}
        columnWidth={columnWidth}
        totalLabel={i18n.t('charts.pivotTable.total')}
        data={results.data ?? []}
        measures={pivotMeasures}
        rowDimension={pivotRowDimension}
        columnDimension={pivotColumnDimension}
        columnTotalsFor={pivotColumnTotalsFor}
        rowTotalsFor={pivotRowTotalsFor}
      />
    </ChartCard>
  );
};

export default PivotTablePro;
