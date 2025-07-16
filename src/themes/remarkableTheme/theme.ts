import { ExportOption } from '../../remarkable-ui/shared/ExportButton/nativeOptions';
import { Resource } from 'i18next';
import { DateTimeFormatter, DateTimeFormatterParams, NumberFormatter, NumberFormatterParams, TextFormatter } from './i18n';
import { RangeConfig } from '../../remarkable-ui/utils/relativeDateRanges';


export type I18nTheme = {
	/** 
	 * Used to pass in the locale you want to use, and any backups (e.g. ['es-AR', 'es-ES', 'en-US'] or simply ['de-DE'])
	 */ 
	preferredLocales: string[];
	/** 
	 * Used to add additional translations (e.g. { ...theme.i18n.translations, { es: { ... } } })
	 */
	translations: Resource;
	
	/** 
	 * Override to customise the default locale logic (by default it will try the `preferredLocales` above in order)
	 */
	locale: (theme: Theme) => Intl.Locale;
	/** 
	 * Override to customise the default number formatter options
	 */
	defaultNumberFormatOptions: (theme: Theme, params?: NumberFormatterParams) => Intl.NumberFormatOptions;
	/** 
	 * Override to customise the default dateTime formatter options
	 */
	defaultDateTimeFormatOptions: (theme: Theme, params?: DateTimeFormatterParams) => Intl.DateTimeFormatOptions;

	/** 
	 * Override if the format options above aren't enough and you want to fully customise the number formatter
	 */
	numberFormatter: (theme: Theme, params?: NumberFormatterParams) => NumberFormatter;
	/**
	 * Override if the format options above aren't enough and you want to fully customise the dateTime formatter
	 */
	dateTimeFormatter: (theme: Theme, params?: DateTimeFormatterParams) => DateTimeFormatter;
	/**
	 * Override if the `translations` above aren't enough and you want to fully customise the text formatter
	 */
	textFormatter: (theme: Theme) => TextFormatter;
};

export type Theme = {
	charts: {
		colors: string[];
		borderColors?: string[];
		legendPosition?: 'top' | 'right' | 'bottom' | 'left';
	};
	//Used to override everything related to internationalisation (i18n)
	i18n: I18nTheme;
	
	//Used to add export options
	customExportOptions?: ExportOption[];

	//Used to override the default relative date ranges shown in the relative date dropdown(s)
	customRelativeDateRanges?: {
		[key: string]: RangeConfig;
	};
	
	//Used to override the default styles across the app
	styles: {
		[key: string]: string; //todo: add specific variables and types
	};
};
