// Embeddable Libraries
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

// Third Party Libraries
import html2canvas from 'html2canvas';
import * as XLSX from 'xlsx';

// Local Libraries
import {
	ExportConfig,
	ExportOptionFlags,
	ExportOptionKey,
} from '../shared/ExportButton/nativeOptions';
import { exportOptions } from '../constants/commonChartInputs';

//This builds the config object that is passed through from each charting component
export function buildExportConfig(
	dataToExport?: DataResponse['data'],
	containerRef?: React.RefObject<HTMLDivElement | null>,
	dimensions?: Dimension[],
	measures?: Measure[],
	title?: string,
	exportFlags?: ExportOptionFlags,
): ExportConfig {
	return {
		containerRef,
		dataToExport,
		dimensions,
		measures,
		title,
		enabledOptions: {
			...exportOptions.reduce(
				(acc, opt) => {
					acc[opt.name] = exportFlags?.[opt.name];
					return acc;
				},
				{} as Partial<Record<ExportOptionKey, boolean>>,
			),
		},
	};
}

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

// shared download helper — creates a temporary link, clicks it, cleans up
function downloadBlob(url: string, fileName: string) {
	const a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

// RFC4180 cell-escaping: wrap in quotes and double any inner quotes
const escapeCell = (val: any): string => {
	const str = val == null ? '' : String(val);
	return `"${str.replace(/"/g, '""')}"`;
};

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
		keys.map((key) => escapeCell((row as any)[key])).join(','),
	);
	// combine into full CSV
	return [headerRow, ...(dataRows ?? [])].join('\r\n');
}

export function exportCSV({ dataToExport, dimensions, measures, title }: ExportConfig) {
	// build CSV text
	const csvData = generateCSVData(dataToExport, dimensions, measures);
	const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);
	// kick off the download
	downloadBlob(url, `${title}.csv`);
}

export function exportExcel({ dataToExport, dimensions, measures, title }: ExportConfig) {
	// build schema once
	const { keys, headers } = buildSchema(dimensions, measures);
	// prepare sheet: header row + raw data rows
	const sheetData = [
		headers,
		...(dataToExport?.map((row) => keys.map((key) => (row as any)[key] ?? '')) ?? []),
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
