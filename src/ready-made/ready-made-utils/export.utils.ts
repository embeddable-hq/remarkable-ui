import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ExportConfig } from '../ready-made-types/export.types';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

// RFC4180 cell-escaping: wrap in quotes and double any inner quotes
const escapeCell = (val: unknown): string => {
  const str = val == null ? '' : String(val);
  return `"${str.replace(/"/g, '""')}"`;
};

// helper to extract field keys & header labels from dimensions/measures
function buildSchema(
  dimensions?: Dimension[],
  measures?: Measure[],
): { keys: string[]; headers: string[] } {
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
  dimensions?: Dimension[],
  measures?: Measure[],
): string {
  const { keys, headers } = buildSchema(dimensions, measures);
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

export function exportCSV({ data, dimensions, measures, title }: ExportConfig) {
  // build CSV text
  const csvData = generateCSVData(data, dimensions, measures);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  // kick off the download
  downloadBlob(url, `${title}.csv`);
}

export function exportXLSX({ data, dimensions, measures, title }: ExportConfig) {
  // build schema once
  const { keys, headers } = buildSchema(dimensions, measures);
  // prepare sheet: header row + raw data rows
  const sheetData = [
    headers,
    ...(data?.map((row) => keys.map((key) => (row as never)[key] ?? '')) ?? []),
  ];
  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  // XLSX.writeFile handles blob creation & download for us
  XLSX.writeFile(workbook, `${title}.xlsx`);
}

export async function exportPNG({ title, containerRef }: ExportConfig): Promise<void> {
  const element = containerRef?.current;
  if (!element) {
    throw new Error('exportPNG: element is undefined');
  }
  // hide any elements marked to ignore in the export
  const hidden = Array.from(
    element.querySelectorAll<HTMLElement>('[data-png-export-ignore]') || [],
  );
  hidden.forEach((el) => (el.style.display = 'none'));

  // render to canvas
  const canvas = await html2canvas(element, {
    useCORS: true, // in case of external images
    backgroundColor: null, // preserve transparency
    scale: window.devicePixelRatio, // high-res output
    allowTaint: true, // allow cross-origin images
  });

  // restore hidden elements
  hidden.forEach((el) => (el.style.display = ''));

  // convert canvas to blob & download
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) return reject(new Error('Could not convert canvas to Blob'));
      const url = URL.createObjectURL(blob);
      downloadBlob(url, `${title}.png`);
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/png');
  });
}
