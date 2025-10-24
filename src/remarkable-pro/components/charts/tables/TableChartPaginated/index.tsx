import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, DimensionOrMeasure, OrderDirection } from '@embeddable.com/core';
import { getStyleNumber, TablePaginated } from '../../../../../remarkable-ui';
import { useEffect, useRef, useState } from 'react';
import { useObserverHeight } from '../../../../../remarkable-ui/hooks/useObserverHeight.hook';
import { useTableGetRowsPerPage } from '../../../../../remarkable-ui/charts/tables/Table.hooks';
import { getTableHeaders } from '../tables.utils';

const headerHeight = getStyleNumber('--em-table-size-cell-height_R' as any, '2.5rem') as number;
const rowHeight = getStyleNumber('--em-table-size-cell-height_R' as any, '2.5rem') as number;
const footerHeight = getStyleNumber('--em-table-size-footer-height_R' as any, '3rem') as number;

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
  const [total, setTotal] = useState<number | undefined>(undefined);

  const { description, title } = resolveI18nProps(props);
  const { results, dimensionsAndMeasures, page = 0, sort, setPage, setSort } = props;

  const headers = getTableHeaders({ dimensionsAndMeasures }, theme);
  const rows = results?.data || [];

  const cardContentRef = useRef<HTMLDivElement>(null);

  const chartHeight = useObserverHeight(cardContentRef);
  const pageSize = useTableGetRowsPerPage({
    availableHeight: chartHeight,
    headerHeight,
    rowHeight,
    footerHeight,
  });

  useEffect(() => {
    if (pageSize) {
      props.setPageSize(pageSize);
    }
  }, [pageSize]);

  useEffect(() => {
    if (results?.total && results.total !== total) {
      setTotal(results.total);
    }
  }, [results]);

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
        headers={headers}
        rows={rows}
        showIndex
        page={page}
        pageSize={pageSize}
        total={total}
        sort={sort}
        onSortChange={setSort}
        onPageChange={setPage}
      />
    </ChartCard>
  );
};

export default TableChartPaginatedPro;
