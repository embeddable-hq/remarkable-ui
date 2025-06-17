import { configProps, valueProps } from '../../remarkable-ui/utils/formatUtils';
import { ExportOption } from '../../remarkable-ui/shared/ExportButton';

export type Theme = {
	charts: {
		colors: string[];
		borderColors?: string[];
		legendPosition?: 'top' | 'right' | 'bottom' | 'left';
	};
	customDateFormatFunction?: (value: valueProps, config?: configProps) => string;
	customDateFormats?: {
		[key: string]: string;
	};
	customExportOptions?: ExportOption[];
	customFormatFunction?: (value: valueProps, config?: configProps) => string;
	customNumberFormatFunction?: (value: valueProps, config?: configProps) => string;
	customTextFormatFunction?: (value: valueProps, config?: configProps) => string;
	styles?: {
		[key: string]: string; //todo: add specific variables and types
	};
};
