import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { DownloadCSVIcon, DownloadPNGIcon } from '../../constants/icons';
import { exportCSV, exportExcel, exportPNG } from '../../utils/exportUtils';

/*
To add a new export option to all chart components at once, first add it here. 
Finally, add it to the exportOptions array in commonChartInputs.tsx.
It will be dynamically added to all charts that import the exportOptions array. 
*/

export type ExportOptionKey = 'downloadCSV' | 'downloadPNG' | 'downloadExcel';

//This is the type of the flags that are passed through from each component via enabledOptions.
export type ExportOptionFlags = Partial<Record<ExportOptionKey, boolean>>;

export type ExportOption = {
	id: string;
	label: string;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	fn: (config: ExportConfig) => void;
};

//This is the config object that is passed through from each component to the export function, containing the key information needed to export.
export type ExportConfig = {
	dataToExport?: DataResponse['data'];
	dimensions?: Dimension[];
	measures?: Measure[];
	title?: string;
	enabledOptions?: ExportOptionFlags;
	containerRef?: React.RefObject<HTMLDivElement | null>;
};

export const nativeExportOptions: Record<ExportOptionKey, ExportOption> = {
	downloadCSV: {
		id: 'downloadCSV',
		label: 'ExportOptions.downloadCSV.label',
		icon: DownloadCSVIcon,
		fn: (config) => exportCSV(config),
	},
	downloadExcel: {
		id: 'downloadExcel',
		label: 'ExportOptions.downloadExcel.label',
		icon: DownloadPNGIcon,
		fn: (config) => exportExcel(config),
	},
	downloadPNG: {
		id: 'downloadPNG',
		label: 'ExportOptions.downloadPNG.label',
		icon: DownloadPNGIcon,
		fn: (config) => exportPNG(config),
	},
};
