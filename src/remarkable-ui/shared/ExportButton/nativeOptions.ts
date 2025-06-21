import { DownloadCSVIcon, DownloadPNGIcon } from '../../constants/icons';
import { exportCSV, exportExcel, exportPNG } from '../../utils/exportUtils';
import { ExportConfig } from './useExportItems';

export type ExportOptionKey = 'downloadCSV' | 'downloadPNG' | 'downloadExcel';

export type ExportOption = {
	id: string;
	label: string;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	fn: (config: ExportConfig) => void;
};

export const nativeExportOptions: Record<ExportOptionKey, ExportOption> = {
	downloadCSV: {
		id: 'downloadCSV',
		label: 'Download CSV',
		icon: DownloadCSVIcon,
		fn: (config) => exportCSV(config),
	},
	downloadExcel: {
		id: 'downloadExcel',
		label: 'Download XLSX',
		icon: DownloadPNGIcon,
		fn: (config) => exportExcel(config),
	},
	downloadPNG: {
		id: 'downloadPNG',
		label: 'Download PNG',
		icon: DownloadPNGIcon,
		fn: (config) => exportPNG(config),
	},
};
