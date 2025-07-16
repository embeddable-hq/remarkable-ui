import { DimensionOrMeasure, isDimension } from "@embeddable.com/core";
import { DateTimeFormatterParams, NumberFormatterParams, TextFormatterParams } from "../../themes/remarkableTheme/i18n";
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
    data: (key: DimensionOrMeasure, value: any) => string;
    /**
     * @returns the currently active locale (e.g. 'en-GB')
     */
    locale: () => Intl.Locale
    /**
     * @returns the currently active language (e.g. 'en', 'de' or 'es')
     */
    language: () => string
}

type Meta = {
    currency?: string
}

const useFormatter = (): FormatHelper => {
    const theme = useTheme() as Theme;
    const { i18n } = theme;
    const textFormatter = i18n.textFormatter(theme);
    const numberFormatter = i18n.numberFormatter(theme);
    return {
        locale: () => i18n.locale(theme),
        language: () => i18n.locale(theme).language,
        text: (key: string, params?: TextFormatterParams) => {
            return textFormatter.format(key, params);
        },
        number: (value: number | bigint, params?: NumberFormatterParams) => {
            return i18n.numberFormatter(theme, params).format(value);
        },
        dateTime: (value: Date, params?: DateTimeFormatterParams) => {
            return i18n.dateTimeFormatter(theme, params).format(value);
        },
        data: (key: DimensionOrMeasure, value: any) => {
            const prefix = isDimension(key) ? 'Dimension' : 'Measure';
            switch(key.nativeType) {
                case 'number':
                    if((key?.meta as Meta)?.currency) {
                        // currency
                        return i18n
                            .numberFormatter(theme, { currency: (key.meta as Meta).currency })
                            .format(value);
                    }
                    // number
                    return numberFormatter.format(value);
                case 'time': {
                    if(value && ISO_DATE_TIME_REGEX.test(value)) {
                        // date time
                        return i18n
                            .dateTimeFormatter(theme, { granularity: key.inputs?.granularity, shortMonth: true })
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