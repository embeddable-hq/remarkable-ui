//this is where the default remarkable theme will live
//may want to break out css base variables, so they're not included in the theme.
//And import them somewhere else.

import { NumberFormatterParams, DateTimeFormatterParams, Theme, I18nTheme, I18nFormatter, DateTimeFormatter, NumberFormatter } from './theme';
import { cssVariables } from './cssVariables';
import i18next, { Resource, TOptionsBase } from 'i18next';
import { $Dictionary } from 'i18next/typescript/helpers';
import { Dimension, Measure } from '@embeddable.com/core';

const CHART_BORDERS = [
	'#5F6CAF',
	'#EF8A88',
	'#8FBED8',
	'#F4B992',
	'#75B9B0',
	'#B5AEE0',
	'#D28CA5',
	'#D4A373',
	'#A9C5A0',
	'#8CA587',
];

const CHART_COLORS = [
	'#5F6CAF',
	'#EF8A88',
	'#8FBED8',
	'#F4B992',
	'#75B9B0',
	'#B5AEE0',
	'#D28CA5',
	'#D4A373',
	'#A9C5A0',
	'#8CA587',
];

const translations: Resource = {
	en: {
		translation: {
			Dimension: '{{value}}',
			ExportOptions: {
				downloadCSV: {
					label: 'Download CSV'
				},
				downloadExcel: {
					label: 'Download Excel'
				},
				downloadPNG: {
					label: 'Download PNG'
				} 
			},
			Granularity: {
				quarter: 'Q{{quarter}} {{year}}'
			},
			Measure: '{{value}}',
		}
	},
	de: {
		translation: {
			Dimension: '{{value}}',
			'Dimension.customers.country.United States': 'Vereinigte Staaten',
			'Dimension.customers.country.Germany': 'Deutschland',
			'Dimension.customers.country.United Kingdom': 'Vereinigtes Königreich',
			'Dimension.customers.country.New Zealand': 'Neuseeland',
			'Dimension.customers.country.Belgium': 'Belgien',
			'Dimension.customers.country.Australia': 'Australien',
			'Dimension.customers.country.Canada': 'Kanada',
			'Dimension.customers.country.Iceland': 'Island',
			ExportOptions: {
				downloadCSV: {
					label: 'CSV herunterladen'
				},
				downloadExcel: {
					label: 'Excel herunterladen'
				},
				downloadPNG: {
					label: 'PNG herunterladen'
				} 
			},
			Granularity: {
				quarter: '{{quarter}}. Quartal {{year}}'
			},
			Measure: '{{value}}',
		}
	}
}

const i18n: I18nTheme = {
	preferredLocales: [navigator.language],
	locale: (theme: Theme) => {
		for(const locale of theme.i18n.preferredLocales) {
			try {
				return new Intl.Locale(locale);
			} catch (e) {
				console.debug('Unsupported locale: '+locale);
			}
		}
		return new Intl.Locale('en-US'); // fall back to en-US whic should work everywhere
	},
	defaultDateTimeFormatOptions: (theme: Theme, params?: DateTimeFormatterParams): Intl.DateTimeFormatOptions => {
		return { 
			year: 'numeric', 
			month: 'numeric', 
			day: 'numeric', 
			hour: 'numeric', 
			minute: 'numeric', 
			second: 'numeric'
		}
	},
	defaultNumberFormatOptions: (theme: Theme, params?: NumberFormatterParams): Intl.NumberFormatOptions => {
		return { 
			minimumFractionDigits: params?.minimumFractionDigits,
			maximumFractionDigits: params?.maximumFractionDigits
		}
	},
	i18nFormatter: function (theme: Theme): I18nFormatter {
		const { locale, translations } = theme.i18n;
		i18next.init({
			lng: locale(theme).language, 
			debug: true,
			resources: translations
		});
		return {
			text: function (key: string, params?: $Dictionary): string {
				return i18next.t(key, params);
			},
			number: function (params?: NumberFormatterParams): NumberFormatter {
				const formatter = new Intl.NumberFormat(
					theme.i18n.locale(theme), 
					theme.i18n.defaultNumberFormatOptions(theme, params)
				);
				return { format: (number: number | bigint) => formatter.format(number) }
			},
			dateTime: function (params?: DateTimeFormatterParams) : DateTimeFormatter {
				const { i18n } = theme;
				const locale = i18n.locale(theme);
				const { year, month, day, hour, minute, second } = i18n.defaultDateTimeFormatOptions(theme, params);
				if(!params?.granularity) {
					return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
				}
				switch(params.granularity) {
					case 'year':
						return new Intl.DateTimeFormat(locale, { year });
					case 'quarter': {
						const formatter = i18n.i18nFormatter(theme);
						return { 
							format: function (date: Date): string {
								return formatter.text('Granularity.quarter', { 
									quarter: Math.floor(date.getMonth() / 3) + 1,
									year: date.getFullYear() 
								})
							}
						}
					}
					case 'month':
						return new Intl.DateTimeFormat(locale, { year, month });
					case 'week':
					case 'day':
						return new Intl.DateTimeFormat(locale, { year, month, day });
					case 'hour':
					case 'minute':
					case 'second':
						return new Intl.DateTimeFormat(locale, { year, month, day, hour, minute, second });
				}
			},
			dimension: function (dimension: Dimension, value?: any): string {
				const keys = [
					`Dimension.${dimension.name}.${value}`, 
					`Dimension.${dimension.name}`, 
					'Dimension'
				];
				return i18next.t(keys, { value: value });
			},
			measure: function (measure: Measure, value?: any): string {
				const keys = [
					`Measure.${measure.name}.${value}`, 
					`Measure.${measure.name}`, 
					'Measure'
				]
				return i18next.t(keys, { value: value });
			}
		}
	},
	translations: translations
};

export const remarkableTheme: Theme = {
	styles: cssVariables,
	charts: {
		borderColors: CHART_BORDERS,
		colors: CHART_COLORS,
	},
	i18n: i18n
};

export default remarkableTheme;
