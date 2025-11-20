import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../theme/theme.types';
import { i18n, i18nSetup } from '../../../../theme/i18n/i18n';
import { ChartCard } from '../../shared/ChartCard/ChartCard';
import { resolveI18nProps } from '../../../component.utils';
import { DataResponse, Dimension, DimensionOrMeasure, OrderDirection } from '@embeddable.com/core';
import {
  getStyleNumber,
  getTableTotalPages,
  TablePaginated,
  useTableGetRowsPerPage,
  useDebounce,
} from '../../../../../remarkable-ui';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useObserverHeight } from '../../../../../remarkable-ui/hooks/useObserverHeight.hook';
import { getTableHeaders, getTableRows } from '../tables.utils';
import { ChartCardMenuProOptionOnClickProps } from '../../shared/ChartCard/ChartCardMenuPro/ChartCardMenuPro.types';

const hasSortChanges = (
  sort: TableChartPaginatedProState['sort'],
  sortToCompare: TableChartPaginatedProState['sort'],
): boolean => {
  const changed =
    sort?.id !== sortToCompare?.id ||
    sort?.direction !== sortToCompare?.direction ||
    (!sort && !!sortToCompare) ||
    (!!sort && !sortToCompare);

  return changed;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

const headerHeight = getStyleNumber('--TEMP-table-size-cell-height_R' as any, '2.5rem') as number;
const rowHeight = getStyleNumber('--TEMP-table-size-cell-height_R' as any, '2.5rem') as number;
const footerHeight = getStyleNumber('--TEMP-table-size-footer-height_R' as any, '3rem') as number;

let downloadData: (data: DataResponse['data']) => void;

export type TableChartPaginatedProOnRowClickArg = string | null;
export type TableChartPaginatedProState = {
  page: number;
  pageSize?: number;
  sort?: { id: string; direction: OrderDirection } | undefined;
  isLoadingDownloadData: boolean;
};

type TableChartPaginatedProProps = {
  embeddableState: TableChartPaginatedProState;
  title: string;
  description: string;
  displayNullAs?: string;
  results: DataResponse;
  dimensionsAndMeasures: DimensionOrMeasure[];
  showIndex: boolean;
  allResults?: DataResponse;
  clickDimension?: Dimension;
  state: TableChartPaginatedProState;
  setState: React.Dispatch<React.SetStateAction<TableChartPaginatedProState>>;
  onRowClicked: (rowDimensionValue: TableChartPaginatedProOnRowClickArg) => void;
};

const TableChartPaginatedPro = (props: TableChartPaginatedProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);

  const [total, setTotal] = useState<number | undefined>(undefined);
  const [isDownloadingData, setIsDownloadingData] = useState(false);

  const { description, title } = resolveI18nProps(props);
  const {
    results,
    allResults,
    dimensionsAndMeasures,
    displayNullAs,
    showIndex,
    clickDimension,
    state,
    setState,
    onRowClicked,
  } = props;

  const [localSort, setLocalSort] = useState(state.sort);

  const headers = getTableHeaders({ dimensionsAndMeasures, displayNullAs }, theme);
  const rows = results?.data || [];
  const tableRows = getTableRows({ rows, clickDimension });
  const cardContentRef = useRef<HTMLDivElement>(null);
  const chartHeight = useObserverHeight(cardContentRef);
  const pageSize = useTableGetRowsPerPage({
    availableHeight: chartHeight,
    headerHeight,
    rowHeight,
    footerHeight,
  });

  // Stable updater for embeddable state
  const handleUpdateEmbeddableState = useCallback(
    (newState: Partial<TableChartPaginatedProState>) => {
      setState((prevState) => ({
        ...prevState,
        ...newState,
      }));
    },
    [setState],
  );

  const handleCustomDownload = (
    onDownload: (props: ChartCardMenuProOptionOnClickProps) => void,
  ) => {
    setIsDownloadingData(true);
    handleUpdateEmbeddableState({ isLoadingDownloadData: true });

    downloadData = (data: DataResponse['data']) =>
      onDownload({
        title,
        data,
        dimensionsAndMeasures,
        containerRef: cardContentRef,
        theme,
      });
  };

  const handleRowIndexClick = (rowIndex: number) => {
    if (!clickDimension) return;

    const rowDimensionValue = rows[rowIndex]?.[clickDimension.name];
    onRowClicked(rowDimensionValue);
  };

  const debouncedUpdateState = useDebounce(handleUpdateEmbeddableState);

  // Sync local sort with embeddable state
  useEffect(() => {
    if (hasSortChanges(state.sort, localSort)) setLocalSort(state.sort);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.sort]);

  // Debounce sort updates to embeddable state
  useEffect(() => {
    debouncedUpdateState({ sort: localSort });
  }, [localSort, debouncedUpdateState]);

  // Sync page size changes to embeddable state
  useEffect(() => {
    if (pageSize) {
      handleUpdateEmbeddableState({ pageSize });
    }
  }, [pageSize, handleUpdateEmbeddableState]);

  // Sync total from results
  useEffect(() => {
    if (results?.total && results.total !== total) {
      setTotal(results.total);
    }
  }, [results, total]);

  // Handle data download when allResults is ready
  useEffect(() => {
    if (isDownloadingData) {
      if (!allResults || allResults.isLoading) {
        // Loading data to download
        return;
      }

      downloadData(allResults.data);
      setIsDownloadingData(false);
      handleUpdateEmbeddableState({ isLoadingDownloadData: false });
    }
  }, [isDownloadingData, allResults, handleUpdateEmbeddableState]);

  return (
    <ChartCard
      ref={cardContentRef}
      title={title}
      subtitle={description}
      data={results}
      dimensionsAndMeasures={dimensionsAndMeasures}
      errorMessage={results?.error}
      onCustomDownload={handleCustomDownload}
    >
      <TablePaginated
        onRowIndexClick={handleRowIndexClick}
        headers={headers}
        rows={tableRows}
        showIndex={showIndex}
        page={state.page}
        pageSize={pageSize}
        paginationLabel={i18n.t('charts.tablePaginated.pagination', {
          page: state.page + 1,
          totalPages: getTableTotalPages(total, pageSize) ?? '?',
        })}
        total={total}
        sort={localSort}
        onSortChange={(newSort) => {
          setLocalSort(newSort as TableChartPaginatedProState['sort']);
        }}
        onPageChange={(newPage) => handleUpdateEmbeddableState({ page: newPage })}
      />
    </ChartCard>
  );
};

export default TableChartPaginatedPro;
