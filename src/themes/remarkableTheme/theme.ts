import { valueProps, configProps } from '../../remarkable-ui/utils/formatUtils';

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
};