// Embeddable Libraries
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

//Local Libraries
import { ExportConfig } from '../shared/ExportButton/useExportItems';

type ExportConfigArgs = [
	ExportConfig['dataToExport'],
	ExportConfig['dimensions'],
	ExportConfig['measures'],
	ExportConfig['title'],
	ExportConfig['enabledOptions'],
];

export function generateExportConfig(...args: ExportConfigArgs): ExportConfig {
	const [dataToExport, dimensions, measures, title, enabledOptions] = args;
	return { dataToExport, dimensions, measures, title, enabledOptions };
}

export function exportCSV(
	dataToExport?: DataResponse['data'],
	dimensions?: Dimension[],
	measures?: Measure[],
	title?: string,
) {
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
