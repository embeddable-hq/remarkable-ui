import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, DimensionOrMeasure } from '@embeddable.com/core';
import { TablePaginated } from '../../../../../remarkable-ui';
import { TableHeaderItem } from '../../../../../remarkable-ui/charts/tables/tables.types';
import { use } from 'i18next';
import { useRef, useState } from 'react';
import { useObserverHeight } from '../../../../../remarkable-ui/hooks/useObserverHeight.hook';
import { useTableGetRowsPerPage } from '../../../../../remarkable-ui/charts/tables/Table.hooks';

const getHeaders = (dimensionsAndMeasures: DimensionOrMeasure[]): TableHeaderItem<any>[] => {
  return dimensionsAndMeasures.map((dimOrMeas) => ({
    id: dimOrMeas.name,
    title: dimOrMeas.title,
  }));
};
type TableChartPaginatedProProps = {
  title: string;
  description: string;
  results: DataResponse;
  dimensionsAndMeasures: DimensionOrMeasure[];
};

const TableChartPaginatedPro = (props: TableChartPaginatedProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const { description, title } = resolveI18nProps(props);
  const { results, dimensionsAndMeasures } = props;

  const headers = getHeaders(dimensionsAndMeasures);
  const rows = results.data || [];

  const cardContentRef = useRef<HTMLDivElement>(null);

  const chartHeight = useObserverHeight(cardContentRef);
  const nrOfItems = useTableGetRowsPerPage(chartHeight);

  console.log('nrOfItems', nrOfItems);
  return (
    <ChartCard
      ref={cardContentRef}
      data={results}
      dimensionsAndMeasures={dimensionsAndMeasures}
      errorMessage={results.error}
      subtitle={description}
      title={title}
    >
      <TablePaginated
        currentPage={0}
        headers={headers}
        rows={rows}
        onPageChange={() => null}
        totalPages={10}
      />
    </ChartCard>
  );
};

export default TableChartPaginatedPro;
