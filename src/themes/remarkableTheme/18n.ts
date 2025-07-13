import { Dimension, Granularity, Measure } from '@embeddable.com/core';
import { $Dictionary } from 'i18next/typescript/helpers';
import { Theme, I18nTheme } from './theme';
import i18next, { TOptionsBase } from 'i18next';
import { translations } from './translations';


export type NumberFormatter = {
    format: (number: number | bigint) => string
}
export type DateTimeFormatter = {
    format: (date: Date) => string
}
export type DateTimeFormatterParams = {
    granularity?: Granularity
}
export type NumberFormatterParams = {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
}
export type I18nFormatter = {
    text: (key: string, params?: $Dictionary) => string;
    number: (params?: NumberFormatterParams) => NumberFormatter;
    dateTime: (params?: DateTimeFormatterParams) => DateTimeFormatter
    dimension: (dimension: Dimension, value?: any) => string;
    measure: (measure: Measure, value?: any) => string;
}

export const defaultI18nTheme: I18nTheme = {
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