// Embeddable Libraries
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

// Third Party Libraries
import html2canvas from 'html2canvas';

// Third Party Libraries
import * as XLSX from 'xlsx';

//Local Libraries
import { ExportConfig } from '../shared/ExportButton/useExportItems';

export function exportCSV({ dataToExport, dimensions, measures, title }: ExportConfig) {
	const csvData = generateCSVData(dataToExport, dimensions, measures);
	const csvBlob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
	const csvUrl = URL.createObjectURL(csvBlob);
	const a = document.createElement('a');
	a.href = csvUrl;
	a.download = `${title}.csv`;
	a.click();
}

function generateCSVData(
	dataToExport?: DataResponse['data'],
	dimensions?: Dimension[],
	measures?: Measure[],
): string {
	// Build arrays of field-keys (for lookup) and header labels
	const fieldKeys = [
		...(dimensions?.map((d) => d.name) ?? []),
		...(measures?.map((m) => m.name) ?? []),
	];

	const headerLabels = [
		...(dimensions?.map((d) => d.title ?? d.name) ?? []),
		...(measures?.map((m) => m.title ?? m.name) ?? []),
	];

	// RFC4180 cell-escaping: wrap in quotes and double any inner quotes
	const escapeCell = (val: any) => {
		const str = val == null ? '' : String(val);
		return `"${str.replace(/"/g, '""')}"`;
	};

	// Build header row
	const headerRow = headerLabels.map(escapeCell).join(',');

	// Build data rows
	const dataRows = dataToExport?.map((row) =>
		fieldKeys.map((key) => escapeCell((row as any)[key])).join(','),
	);

	// Combine into full CSV
	return [headerRow, ...(dataRows ?? [])].join('\r\n');
}

export function exportExcel({ dataToExport, dimensions, measures, title }: ExportConfig) {
	// 1) build the same field-key and header arrays as CSV
	const fieldKeys = [
		...(dimensions?.map((d) => d.name) || []),
		...(measures?.map((m) => m.name) || []),
	];
	const headerLabels = [
		...(dimensions?.map((d) => d.title ?? d.name) || []),
		...(measures?.map((m) => m.title ?? m.name) || []),
	];

	// 2) build an "array of arrays": first row is your headers, then each data row
	const sheetData = [
		headerLabels,
		...(dataToExport?.map((row) => fieldKeys.map((key) => (row as any)[key] ?? '')) || []),
	];

	// 3) turn that into a worksheet
	const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

	// 4) append to a new workbook
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

	// 5) trigger a download
	// writeFile automatically creates a blob and clicks an <a> for you
	XLSX.writeFile(workbook, `${title}.xlsx`);
}

export async function exportPNG({ title, containerRef }: ExportConfig): Promise<void> {
	const element = containerRef?.current;
	const fileName = `${title}.png`;

	const hidden = Array.from(
		element?.querySelectorAll<HTMLElement>('[data-png-export-ignore]') || [],
	);
	hidden.forEach((el) => (el.style.display = 'none'));

	if (!element) {
		throw new Error('exportPNG: element is undefined');
	}

	// 1) render the element to a canvas
	const canvas = await html2canvas(element, {
		useCORS: true, // if you have external images
		backgroundColor: null, // preserve transparency
		scale: window.devicePixelRatio, // high-res output
	});

	// 2) restore
	hidden.forEach((el) => (el.style.display = ''));

	// 3) convert the canvas to a Blob and download it
	return new Promise((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (!blob) return reject(new Error('Could not convert canvas to Blob'));

			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');

			a.href = url;
			a.download = fileName;
			a.style.display = 'none';
			document.body.appendChild(a);
			a.click();

			// cleanup
			document.body.removeChild(a);
			URL.revokeObjectURL(url);

			resolve();
		}, 'image/png');
	});
}
