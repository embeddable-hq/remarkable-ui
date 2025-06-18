import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { DownloadCSVIcon, DownloadPNGIcon } from '../../constants/icons';
import { exportCSV } from '../../utils/exportUtils';

export type ExportOptionKey = 'downloadCSV' | 'downloadPNG';

export type ExportOption = {
	id: string;
	label: string;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	fn: (
		data?: DataResponse['data'],
		dimensions?: Dimension[],
		measures?: Measure[],
		title?: string,
	) => void;
};

export const nativeExportOptions: Record<ExportOptionKey, ExportOption> = {
	downloadCSV: {
		id: 'downloadCSV',
		label: 'Download CSV',
		icon: DownloadCSVIcon,
		fn: (data, dimensions, measures, title) => exportCSV(data, dimensions, measures, title),
	},
	downloadPNG: {
		id: 'downloadPNG',
		label: 'Download PNG',
		icon: DownloadPNGIcon,
		fn: (data, dimensions, measures, title) => null,
	},
};
