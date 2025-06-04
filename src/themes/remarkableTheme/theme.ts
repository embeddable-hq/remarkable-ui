import { valueProps, configProps } from "../../remarkable-ui/utils/formatUtils";
import { DropdownItem } from "../../remarkable-ui/shared/BaseDropdown";

export type Theme = {
	styles?: {
		[key: string]: string; //todo: add specific variables and types
	};
	charts: {
		colors: string[];
		borderColors?: string[];
		legendPosition?: "top" | "right" | "bottom" | "left";
	};
	customFormatFunction?: (value: valueProps, config?: configProps) => string;
	customDateFormatFunction?: (
		value: valueProps,
		config?: configProps,
	) => string;
	customTextFormatFunction?: (
		value: valueProps,
		config?: configProps,
	) => string;
	customNumberFormatFunction?: (
		value: valueProps,
		config?: configProps,
	) => string;
	customDateFormats?: {
		[key: string]: string;
	};
	customExportOptions?: DropdownItem[];
};
