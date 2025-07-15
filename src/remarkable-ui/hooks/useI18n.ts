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
                    return numberFormatter.format(value);
                case 'time': {
                    if(value && ISO_DATE_TIME_REGEX.test(value)) {
                        return i18n
                            .dateTimeFormatter(theme, { granularity: key.inputs?.granularity })
                            .format(new Date(value))
                    }
                }
                case 'string':
                case 'boolean':
            }
            const name = key.name;
            const keys = [
                `${prefix}.${name}.${value}`, 
                `${prefix}.${name}`, 
                `${prefix}`
            ];
            return textFormatter.format(keys, { value: value, type: key.nativeType })
        }
    }
}
    
export default useI18n;