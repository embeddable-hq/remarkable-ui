import { useMemo } from 'react';

type UseTableGetRowsPerPageProps = {
  availableHeight: number;
  headerHeight: number;
  rowHeight: number;
  footerHeight?: number;
};
export const useTableGetRowsPerPage = ({
  availableHeight,
  headerHeight,
  rowHeight,
  footerHeight = 0,
}: UseTableGetRowsPerPageProps): number =>
  useMemo(() => {
    const h = availableHeight;
    if (!h) return 0;

    // Available vertical space for BODY rows only
    let available = h - headerHeight - footerHeight;
    if (available < 0) available = 0;

    // DO NOT show partial rows: floor only
    const rows = Math.floor(available / rowHeight);
    return Math.max(0, rows);
  }, [availableHeight, headerHeight, rowHeight, footerHeight]);
