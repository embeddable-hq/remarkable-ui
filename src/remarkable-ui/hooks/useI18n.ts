import { DimensionOrMeasure, isDimension, isDimensionOrMeasure } from "@embeddable.com/core";
import { DateTimeFormatterParams, NumberFormatter, NumberFormatterParams, TextFormatterParams } from "../../themes/remarkableTheme/18n";
import { Theme } from "../../themes/remarkableTheme/theme";

const ISO_DATE_TIME_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}$/

export type I18nFormatter = {
    text: (key: string, params?: TextFormatterParams) => string;
    number: (value: number | bigint, params?: NumberFormatterParams) => string;
    dateTime: (value: Date, params?: DateTimeFormatterParams) => string;
    data: (key: DimensionOrMeasure, value: any) => string;
}

type Meta = {
    currency?: string
}

const useI18n = (theme: Theme): I18nFormatter => {
    const { i18n } = theme;
    const textFormatter = i18n.textFormatter(theme);
    const numberFormatter = i18n.numberFormatter(theme);
    return {
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
                            .dateTimeFormatter(theme, { granularity: key.inputs?.granularity })
                            .format(new Date(value))
                    }
                }
                case 'boolean':
                    // treat as string
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
    
export default useI18n;