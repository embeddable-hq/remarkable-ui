import { useLayoutEffect, useMemo, useRef, useState } from 'react';

const HEADER_PX = 40;
const ROW_PX = 40;
const FOOTER_PX = 48;

export const useTableGetRowsPerPage = (wrapperHeight: number): number =>
  useMemo(() => {
    console.log('wrapperHeight', wrapperHeight);
    const h = wrapperHeight;
    if (!h) return 0;

    // Available vertical space for BODY rows only
    let available = h - HEADER_PX - FOOTER_PX;
    if (available < 0) available = 0;

    // DO NOT show partial rows: floor only
    const rows = Math.floor(available / ROW_PX);
    return Math.max(0, rows);
  }, [wrapperHeight]);
