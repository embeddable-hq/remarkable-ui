import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import * as XLSX from 'xlsx';
import domtoimage from 'dom-to-image-more';
import { Theme } from '../theme.types';
import { getThemeFormatter } from '../formatter/formatter.utils';
import { ChartCardMenuOptionOnClickProps } from '../defaults/defaults.ChartCardMenu.constants';

// RFC4180 cell-escaping: wrap in quotes and double any inner quotes
const escapeCell = (val: unknown): string => {
  const str = val == null ? '' : String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

const downloadBlob = (url: string, fileName: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const formatData = (
  data: DataResponse['data'],
  dimensionsAndMeasures: (Dimension | Measure)[],
  theme: Theme,
): Array<Array<string>> => {
  const themeFormatter = getThemeFormatter(theme);

  const headers = dimensionsAndMeasures.map((dm) => {
    return themeFormatter.dimensionOrMeasureTitle(dm);
  });
  const body = data!.map((dataRow) => {
    const row: Array<string> = [];
    dimensionsAndMeasures.forEach((dimensionOrMeasure) => {
      const value = themeFormatter.data(dimensionOrMeasure, dataRow[dimensionOrMeasure.name]);
      if (value !== undefined && value !== null) {
        row.push(String(value));
      } else {
        row.push('');
      }
    });
    return row;
  });

  return [headers, ...body];
};

export function exportCSV({
  data = [],
  dimensionsAndMeasures = [],
  title,
  theme,
}: ChartCardMenuOptionOnClickProps) {
  const csvData = formatData(data, dimensionsAndMeasures, theme)
    .map((row) => row.map(escapeCell).join(','))
    .join('\r\n');
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  downloadBlob(url, `${title ?? 'untitled'}.csv`);
}

export function exportXLSX({
  data = [],
  dimensionsAndMeasures = [],
  title,
  theme,
}: ChartCardMenuOptionOnClickProps) {
  const xlsxData = formatData(data, dimensionsAndMeasures, theme);

  const worksheet = XLSX.utils.aoa_to_sheet(xlsxData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // XLSX.writeFile handles blob creation & download for us
  XLSX.writeFile(workbook, `${title ?? 'untitled'}.xlsx`);
}

export async function exportPNG({
  title,
  containerRef,
}: ChartCardMenuOptionOnClickProps): Promise<void> {
  const element = containerRef?.current;
  if (!element) {
    throw new Error('exportPNG: element is undefined');
  }

  try {
    const dataUrl = await domtoimage.toPng(element, {
      cacheBust: true,
      filter: (node: unknown) => {
        if (node instanceof HTMLElement && node.hasAttribute('data-no-export')) {
          return false; // exclude elements with data-no-export
        }
        return true;
      },
    });

    // Convert data URL to Blob for download
    const res = await fetch(dataUrl);
    const blob = await res.blob();

    const url = URL.createObjectURL(blob);
    downloadBlob(url, `${title ?? 'untitled'}.png`);
    URL.revokeObjectURL(url);
  } catch (error) {
    throw new Error(`exportPNG failed: ${(error as Error).message}`);
  }
}
