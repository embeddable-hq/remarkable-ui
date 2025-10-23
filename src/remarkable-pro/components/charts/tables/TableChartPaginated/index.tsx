import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, DimensionOrMeasure, OrderDirection } from '@embeddable.com/core';
import { getStyleNumber, TablePaginated } from '../../../../../remarkable-ui';
import { TableHeaderItem } from '../../../../../remarkable-ui/charts/tables/tables.types';
import { useEffect, useRef } from 'react';
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
  page: number;
  pageSize: number;
  sort?: { id: string; direction: OrderDirection };
  setSort: any;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
};

const TableChartPaginatedPro = (props: TableChartPaginatedProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const { description, title } = resolveI18nProps(props);
  const { results, dimensionsAndMeasures, page = 0, sort, setPage, setSort } = props;

  const headers = getHeaders(dimensionsAndMeasures);
  const rows = results?.data || [];

  const cardContentRef = useRef<HTMLDivElement>(null);

  const chartHeight = useObserverHeight(cardContentRef);
  const pageSize = useTableGetRowsPerPage({
    availableHeight: chartHeight,
    headerHeight: getStyleNumber('--em-table-size-cell-height_R' as any, '2.5rem') as number,
    rowHeight: getStyleNumber('--em-table-size-cell-height_R' as any, '2.5rem') as number,
    footerHeight: getStyleNumber('--em-table-size-footer-height_R' as any, '3rem') as number,
  });

  useEffect(() => {
    if (pageSize) {
      props.setPageSize(pageSize);
    }
  }, [pageSize]);

  return (
    <ChartCard
      ref={cardContentRef}
      title={title}
      subtitle={description}
      data={results}
      dimensionsAndMeasures={dimensionsAndMeasures}
      errorMessage={results?.error}
    >
      <TablePaginated
        showIndex
        headers={headers}
        rows={rows}
        sort={sort}
        onSortChange={setSort}
        page={page}
        pageSize={pageSize}
        total={results?.total}
        onPageChange={setPage}
      />
    </ChartCard>
  );
};

export default TableChartPaginatedPro;
