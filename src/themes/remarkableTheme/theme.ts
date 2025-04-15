import { valueProps, configProps } from '../../remarkable-ui/utils/formatUtils';
import { DropdownItem } from '../../remarkable-ui/shared/Dropdown';

export type Theme = {
    cssVariables: {
        [key: string]: string;
    };
    charts: {
        colors: string[];
        borderColors: string[];
    };
    customFormatFunction?: (value: valueProps, config?: configProps) => string;
    customDateFormats?: {
        [key: string]: string;
    };
    customExportOptions?: DropdownItem[];
};