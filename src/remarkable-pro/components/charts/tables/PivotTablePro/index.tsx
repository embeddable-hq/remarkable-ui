import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18n, i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { PivotTable, PivotTableProps } from '../../../../../remarkable-ui';
import { useRef } from 'react';
import { getThemeFormatter } from '../../../../theme/formatter/formatter.utils';
import { useFillGaps } from '../../charts.newFillGaps.hooks';

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
  columnWidth: number;
};

const getPivotMeasures = (
  props: { measures: Measure[]; displayNullAs?: string },
  theme: Theme,
): PivotTableProps<any>['measures'] => {
  const themeFormatter = getThemeFormatter(theme);

  return props.measures.map((measure) => {
    return {
      key: measure.name,
      label: themeFormatter.dimensionOrMeasureTitle(measure),
      showAsPercentage: Boolean(measure.inputs?.showAsPercentage),
      percentageDecimalPlaces: measure.inputs?.percentageDecimalPlaces,
      accessor: (row) => {
        const value = row[measure.name];

        return value == null
          ? props.displayNullAs
          : themeFormatter.data(measure, row[measure.name]);
      },
    };
  });
};

const getPivotDimension = (
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

const getPivotColumnTotalsFor = (props: {
  measures: Measure[];
}): PivotTableProps<any>['columnTotalsFor'] | undefined => {
  return props.measures.filter((m) => m.inputs?.showColumnTotal).map((m) => m.name);
};

const PivotTablePro = (props: PivotTableProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const { description, title } = resolveI18nProps(props);
  const { measures, rowDimension, columnDimension, showRowTotals, displayNullAs } = props;

  const results = useFillGaps({ results: props.results, dimension: columnDimension });

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
