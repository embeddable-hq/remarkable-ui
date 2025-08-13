import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import * as XLSX from 'xlsx';
import domtoimage from 'dom-to-image-more';
import { ThemeChartsMenuOptionActionProps } from '../theme.types';

// RFC4180 cell-escaping: wrap in quotes and double any inner quotes
const escapeCell = (val: unknown): string => {
  const str = val == null ? '' : String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

// helper to extract field keys & header labels from dimensions/measures
function buildSchema(dimensionsAndMeasures?: (Dimension | Measure)[]): {
  keys: string[];
  headers: string[];
} {
  const dimensions = (dimensionsAndMeasures || []).filter(
    (dimensionOrMeasure) => dimensionOrMeasure.__type__ === 'dimension',
  ) as Dimension[];
  const measures = (dimensionsAndMeasures || []).filter(
    (dimensionOrMeasure) => dimensionOrMeasure.__type__ === 'measure',
  ) as Measure[];

  return {
    keys: [...(dimensions?.map((d) => d.name) ?? []), ...(measures?.map((m) => m.name) ?? [])],
    headers: [
      ...(dimensions?.map((d) => d.title ?? d.name) ?? []),
      ...(measures?.map((m) => m.title ?? m.name) ?? []),
    ],
  };
}

// generate CSV data string from raw data
function generateCSVData(
  dataToExport?: DataResponse['data'],
  dimensionsAndMeasures?: (Dimension | Measure)[],
): string {
  const { keys, headers } = buildSchema(dimensionsAndMeasures);
  // escape headers & cells properly
  const headerRow = headers.map(escapeCell).join(',');
  const dataRows = dataToExport?.map((row) =>
    keys.map((key) => escapeCell((row as never)[key])).join(','),
  );
  // combine into full CSV
  return [headerRow, ...(dataRows ?? [])].join('\r\n');
}

// shared download helper — creates a temporary link, clicks it, cleans up
function downloadBlob(url: string, fileName: string) {
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function exportCSV({
  data,
  dimensionsAndMeasures,
  title,
}: ThemeChartsMenuOptionActionProps) {
  // build CSV text
  const csvData = generateCSVData(data, dimensionsAndMeasures);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  // kick off the download
  downloadBlob(url, `${title ?? 'untitled'}.csv`);
}

export function exportXLSX({
  data,
  dimensionsAndMeasures,
  title,
}: ThemeChartsMenuOptionActionProps) {
  // build schema once
  const { keys, headers } = buildSchema(dimensionsAndMeasures);
  const sheetData = [
    headers,
    ...(data?.map((row) => keys.map((key) => (row as never)[key] ?? '')) ?? []),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // XLSX.writeFile handles blob creation & download for us
  XLSX.writeFile(workbook, `${title ?? 'untitled'}.xlsx`);
}

export async function exportPNG({
  title,
  containerRef,
}: ThemeChartsMenuOptionActionProps): Promise<void> {
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
