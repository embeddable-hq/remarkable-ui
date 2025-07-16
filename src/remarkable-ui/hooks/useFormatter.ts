import { DimensionOrMeasure, isDimension } from "@embeddable.com/core";
import { DateTimeFormatter, DateTimeFormatterParams, NumberFormatter, NumberFormatterParams, TextFormatterParams } from "../../themes/remarkableTheme/i18n";
import { Theme } from "../../themes/remarkableTheme/theme";
import { useTheme } from "@embeddable.com/react";

const ISO_DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/

export type FormatHelper = {
    /**
     * Retrieves a translation
     * @example i18n.text('Charts.other.label')
     * @example i18n.text('Granularity.quarter', { quarter: 3, year: 2025 })
     */
    text: (key: string, params?: TextFormatterParams) => string;
    /**
     * Formats a number in the currently active locale
     * @example i18n.number(123.45)
     * @example i18n.number(123.45, { currency: 'EUR' })
     */
    number: (value: number | bigint, params?: NumberFormatterParams) => string;
    /**
     * Formats a date in the currently active locale
     * @example i18n.dateTime(new Date(), { granularity: 'week' })
     */
    dateTime: (value: Date, params?: DateTimeFormatterParams) => string;
    /**
     * Formats (or translates) a value returned from `loadData
     * @example i18n.data(measure, row[measure.name])
     * @example i18n.data(dimension, row[dimension.name])
     */
    data: (key: DimensionOrMeasure, value: any, config?: Config) => string;
    /**
     * @returns the currently active locale (e.g. 'en-GB')
     */
    locale: () => Intl.Locale
    /**
     * @returns the currently active language (e.g. 'en', 'de' or 'es')
     */
    language: () => string
}

type MeasureMeta = {
    currency?: string
}

type DataConfig = {
    maxCharacterLength?: number;
    decimalPlaces?: number;
    prefix?: string;
    suffix?: string;
} 

/**
 * Creates a formatter cache.
 * Cache used to prevent unnecessary (expensive) creation of formatter objects
 */
function cache<Params, Formatter>(factory: (params?: Params) => Formatter){
    const cache: { [key: string]: Formatter } = {};
    const get = (params?: Params) => {
        const key = JSON.stringify(params);
        let formatter = cache[key];
        if(formatter) {
            return formatter;
        }
        formatter = factory(params);
        cache[key] = formatter;
        return formatter;
    }
    return get;
} 

/**
 * Formatter Helper exists to make it easy to apply standard formatting (and internationalisation) to all components
 */
const useFormatter = (): FormatHelper => {
    const theme = useTheme() as Theme;
    const textFormatter = theme.i18n.textFormatter(theme);
    const numberFormatter = cache<NumberFormatterParams, NumberFormatter>(params => theme.i18n.numberFormatter(theme, params));
    const dateTimeFormatter = cache<DateTimeFormatterParams, DateTimeFormatter>(params => theme.i18n.dateTimeFormatter(theme, params));
    
    return {
        locale: (): Intl.Locale => theme.i18n.locale(theme),
        language: (): string => theme.i18n.locale(theme).language,
        text: (key: string, params?: TextFormatterParams): string => {
            return textFormatter.format(key, params);
        },
        number: (value: number | bigint, params?: NumberFormatterParams): string => {
            return numberFormatter(params).format(value);
        },
        dateTime: (value: Date, params?: DateTimeFormatterParams): string => {
            return dateTimeFormatter(params).format(value);
        },
        data: (key: DimensionOrMeasure, value: any, config?: DataConfig): string => {
            const prefix = isDimension(key) ? 'Dimension' : 'Measure';
            switch(key.nativeType) {
                case 'number':
                    const params: NumberFormatterParams = { 
                        maxDecimalPlaces: config?.decimalPlaces, 
                        minDecimalPlaces: config?.decimalPlaces
                    }
                    if((key?.meta as MeasureMeta)?.currency) {
                        // currency
                        return numberFormatter({ 
                                ...params,
                                currency: (key.meta as MeasureMeta).currency,
                             })
                            .format(value);
                    }
                    // number
                    return numberFormatter(params).format(value);
                case 'time': {
                    if(value && ISO_DATE_TIME_REGEX.test(value)) {
                        // date time
                        return dateTimeFormatter({ granularity: key.inputs?.granularity, shortMonth: true })
                            .format(new Date(value))
                    }
                    // fall through to string formatting for non-ISO time values
                    break;
                }
                case 'boolean':
                    // fall through to string formatting for booleans
                    break;
            }
            // string
            const name = key.name;
            // allow translation at 3 levels of abstraction
            const keys = [
                `${prefix}.${name}.${value}`, // e.g. 'Dimension.customers.country.Germany': 'Deutschland',
                `${prefix}.${name}`, // e.g. 'Dimension.customers.country': 'Country is {{value}}',
                `${prefix}` // e.g. Dimension: '{{value}}',
            ];
            return textFormatter.format(keys, { value: value, type: key.nativeType, name: name })
        }
    }
}
    
export default useFormatter;