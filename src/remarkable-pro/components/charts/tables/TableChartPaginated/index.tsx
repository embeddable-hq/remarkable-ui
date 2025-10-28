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
import { ChartCardMenuProOptionOnClickProps } from '../../shared/ChartCard/ChartCardMenuPro/ChartCardMenuPro.types';

const headerHeight = getStyleNumber('--em-table-size-cell-height_R' as any, '2.5rem') as number;
const rowHeight = getStyleNumber('--em-table-size-cell-height_R' as any, '2.5rem') as number;
const footerHeight = getStyleNumber('--em-table-size-footer-height_R' as any, '3rem') as number;

let downloadData: (data: DataResponse['data']) => void;

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
  state: TableChartPaginatedProState;
  setState: React.Dispatch<React.SetStateAction<TableChartPaginatedProState>>;
} & TableChartPaginatedProState;

const TableChartPaginatedPro = (props: TableChartPaginatedProProps) => {
  const theme = useTheme() as Theme;
  i18nSetup(theme);
  const [total, setTotal] = useState<number | undefined>(undefined);

  const { description, title } = resolveI18nProps(props);
  const { results, allResults, dimensionsAndMeasures, displayNullAs, showIndex, state, setState } =
    props;
  const handleUpdateEmbeddableState = (newState: Partial<TableChartPaginatedProState>) => {
    setState((prevState) => ({
      ...prevState,
      ...newState,
    }));
  };

  const [isDownloadingData, setIsDownloadingData] = useState(false);

  const headers = getTableHeaders({ dimensionsAndMeasures, displayNullAs }, theme);
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
      handleUpdateEmbeddableState({ pageSize });
    }
  }, [pageSize]);

  useEffect(() => {
    if (results?.total && results.total !== total) {
      setTotal(results.total);
    }
  }, [results]);

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
  }, [isDownloadingData, props]);

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
        headers={headers}
        rows={rows}
        showIndex={showIndex}
        page={state.page}
        pageSize={pageSize}
        total={total}
        sort={state.sort}
        onSortChange={(newSort) =>
          handleUpdateEmbeddableState({ sort: newSort as TableChartPaginatedProState['sort'] })
        }
        onPageChange={(newPage) => handleUpdateEmbeddableState({ page: newPage })}
      />
    </ChartCard>
  );
};

export default TableChartPaginatedPro;
