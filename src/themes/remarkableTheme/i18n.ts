import { Granularity } from '@embeddable.com/core';
import { Theme, I18nTheme } from './theme';
import i18next from 'i18next';
import { en } from '../translations/en';


export type NumberFormatter = {
    format: (number: number | bigint) => string
}
export type DateTimeFormatter = {
    format: (date: Date) => string
}
export type TextFormatter = {
    /** 
     * @param key the lookup key for finding the correct translation template (or a list of keys which will be tried in order)
     * @param params the values that can be used to fill in the placeholders in the translation template
     */ 
    format: (key: string | string[], params?: TextFormatterParams) => string
}
export type DateTimeFormatterParams = {
    granularity?: Granularity
    shortYear?: boolean
    shortMonth?: boolean
}
export type NumberFormatterParams = {
    currency?: string // e.g. 'USD'
    minDecimalPlaces?: number // e.g. 0
    maxDecimalPlaces?: number // e.g. 2
}
export type TextFormatterParams<T = unknown> = { [key: string]: T };

export const defaultI18nTheme: I18nTheme = {
	preferredLocales: [navigator.language],
    translations: {
        en
    },
	locale: (theme: Theme) => {
		for(const locale of theme.i18n.preferredLocales) {
			try {
				return new Intl.Locale(locale);
			} catch (e) {
				// not supported in current browser
			}
		}
		return new Intl.Locale('en-US'); // fall back to en-US which should work everywhere
	},
	defaultDateTimeFormatOptions: (theme: Theme, params?: DateTimeFormatterParams): Intl.DateTimeFormatOptions => {
		return { 
			year: params?.shortYear ? '2-digit' : 'numeric', 
			month: params?.shortMonth ? '2-digit' : 'short', 
			day: params?.shortMonth ? '2-digit' : 'numeric', 
			hour: 'numeric', 
			minute: 'numeric', 
			second: 'numeric'
		}
	},
	defaultNumberFormatOptions: (theme: Theme, params?: NumberFormatterParams): Intl.NumberFormatOptions => {
		return { 
            style: params?.currency ? 'currency' : undefined,
            currency: params?.currency,
			minimumFractionDigits: params?.minDecimalPlaces || 0,
			maximumFractionDigits: params?.maxDecimalPlaces || 2
		}
	},
    numberFormatter: (theme: Theme, params?: NumberFormatterParams): NumberFormatter => {
        const formatter = new Intl.NumberFormat(
            theme.i18n.locale(theme), 
            theme.i18n.defaultNumberFormatOptions(theme, params)
        );
        return { format: (number: number | bigint) => formatter.format(number) }
    },
    dateTimeFormatter: (theme: Theme, params?: DateTimeFormatterParams): DateTimeFormatter => {
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
                const formatter = i18n.textFormatter(theme);
                return { 
                    format: (date: Date): string => {
                        return formatter.format('Granularity.quarter', { 
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
    textFormatter: (theme: Theme): TextFormatter => {
        const { locale, translations } = theme.i18n;
        const instance = i18next.createInstance();
		instance.init({
			lng: locale(theme).language, 
			resources: translations
		});
        return { 
            format: (key: string | string[], params?: TextFormatterParams) => {
                return instance.t(key, params);
            } 
        }
    }
};