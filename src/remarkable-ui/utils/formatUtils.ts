// Third Party Libraries
import { format as dateFnsFormat } from 'date-fns';
import { mergician } from 'mergician';

// Local Libraries
import { Theme } from '../../themes/remarkableTheme/theme';

export type valueProps = string | number | Date;
export type typeHintProps = "string" | "number" | "date";
export type configProps = {
    decimalPlaces?: number;  
    pretext?: string;
    posttext?: string;       
    granularity?: string;    
    theme?: Theme;           
    typeHint?: typeHintProps; 
}

// Helper function to add prefix and suffix to formatted values
export function addPrefixAndSuffix(value: valueProps, config?: configProps): string {
    return `${config?.pretext || ''}${value}${config?.posttext || ''}`;
}

// Formats numbers with configurable decimal places and locale-aware separators
function formatNumber(num: number, config?: configProps): string {

    // Check for custom formatting function in theme
    const customNumberFormatFunction = config?.theme?.customNumberFormatFunction;
    if (customNumberFormatFunction) {
        return customNumberFormatFunction(num, config);
    }

    const minimumFractionDigits = config?.decimalPlaces || 0;
    const maximumFractionDigits = config?.decimalPlaces || 2;
    const formatted = new Intl.NumberFormat(undefined, { 
        minimumFractionDigits, 
        maximumFractionDigits 
    }).format(num);
    return addPrefixAndSuffix(formatted, config);
}

// Formats dates with configurable granularity and custom formats from theme
function formatDate(date: Date, config?: configProps): string {

    // Check for custom formatting function in theme
    const customDateFormatFunction = config?.theme?.customDateFormatFunction;
    if (customDateFormatFunction) {
        return customDateFormatFunction(date, config);
    }

    // Get custom date formats from theme if available
    const customDateFormats = config?.theme?.customDateFormats || {};
    
    // Default date formats for different granularities
    const dateFormats = mergician({
        year: 'yyyy',
        quarter: 'MMM yy',
        month: 'MMM yy',
        day: 'd MMM',
        week: 'd MMM',
        hour: 'eee HH:mm',
        minute: 'eee HH:mm',
        second: 'HH:mm:ss'
    }, customDateFormats);

    // Apply the appropriate format based on granularity
    const granularity = config?.granularity;
    if (!granularity) {
        return date.toString();
    }
    const chosenFormat = dateFormats[granularity as keyof typeof dateFormats];
    return dateFnsFormat(date, chosenFormat);
}

// Formats strings by trimming whitespace
function formatString(str: string, config?: configProps): string {

    // Check for custom formatting function in theme
    const customTextFormatFunction = config?.theme?.customTextFormatFunction;
    if (customTextFormatFunction) {
        return customTextFormatFunction(str, config);
    }

    const formatted = str.trim();
    return addPrefixAndSuffix(formatted, config);
}

// Main formatting function that handles all value types
export function formatValue(
    value: valueProps, 
    config?: configProps
): string {
    // Check for custom formatting function in theme
    const customFormatFunction = config?.theme?.customFormatFunction;
    if (customFormatFunction) {
        return customFormatFunction(value, config);
    }

    // If a type hint is provided, use it to determine formatting
    if (config?.typeHint) {
        if (config.typeHint === 'number') {
            const num = Number(value);
            if (!isNaN(num)) return formatNumber(num, config);
        } else if (config.typeHint === 'date') {
            if (value instanceof Date) {
                return formatDate(value, config);
            } else if (typeof value === 'string' || typeof value === 'number') {
                const date = new Date(value);
                if (!isNaN(date.getTime())) return formatDate(date, config);
            }
        } else if (config.typeHint === 'string') {
            return formatString(String(value), config);
        }
    }

    // Auto-detection logic when no type hint is provided
    // Check if it's a number (either directly or a string that looks like a number)
    if (typeof value === 'number' || (typeof value === 'string' && /^\s*-?\d+(\.\d+)?\s*$/.test(value))) {
        const num = Number(value);
        if (!isNaN(num)) return formatNumber(num, config);
    }

    // Check if it's a date (string containing date separators)
    if (typeof value === 'string' && (value.includes('-') || value.includes('/'))) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) return formatDate(date, config);
    }

    // Fallback: treat as string if no other type is detected
    return formatString(String(value), config);
}


