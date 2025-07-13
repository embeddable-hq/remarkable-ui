import { configProps, valueProps } from '../../remarkable-ui/utils/formatUtils';
import { ExportOption } from '../../remarkable-ui/shared/ExportButton/nativeOptions';
import { RangeConfig } from '../../remarkable-ui/utils/relativeDateRanges';
import { Resource } from 'i18next';
import { DateTimeFormatterParams, I18nFormatter, NumberFormatterParams } from './18n';


export type I18nTheme = {
	preferredLocales: string[];
	translations: Resource;
	locale: (theme: Theme) => Intl.Locale;
	i18nFormatter: (theme: Theme) => I18nFormatter;
	defaultNumberFormatOptions: (theme: Theme, params?: NumberFormatterParams) => Intl.NumberFormatOptions;
	defaultDateTimeFormatOptions: (theme: Theme, params?: DateTimeFormatterParams) => Intl.DateTimeFormatOptions;
};

export type Theme = {
	charts: {
		colors: string[];
		borderColors?: string[];
		legendPosition?: 'top' | 'right' | 'bottom' | 'left';
	};
	//Used to override everything related to internationalisation (i18n)
	i18n: I18nTheme;
	//Used to override the default date format function for displayed dates
	customDateFormatFunction?: (value: valueProps, config?: configProps) => string;
	//Used to override the default date formats for different granularities
	customDateFormats?: {
		[key: string]: string;
	};

	customExportOptions?: ExportOption[];
	customFormatFunction?: (value: valueProps, config?: configProps) => string;
	//Used to override the default number format function for displayed numbers
	customNumberFormatFunction?: (value: valueProps, config?: configProps) => string;
	//Used to override the default text format function for displayed text
	customTextFormatFunction?: (value: valueProps, config?: configProps) => string;
	//Used to override the default relative date ranges shown in the relative date dropdown(s)
	customRelativeDateRanges?: {
		[key: string]: RangeConfig;
	};
	//Used to override the default styles across the app
	styles: {
		[key: string]: string; //todo: add specific variables and types
	};
};
