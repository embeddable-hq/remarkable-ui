import dayjs from 'dayjs';
import {
  DataResponse,
  Dimension,
  Granularity,
  TimeRange,
  TimeRangeDeserializedValue,
} from '@embeddable.com/core';
import { Theme } from '../../theme/theme.types';

type DataResponseDataRecord = NonNullable<DataResponse['data']>[number];

const DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DDTHH:mm:ss.SSS',
  WITH_TIMEZONE: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  WITHOUT_TIMEZONE: 'YYYY-MM-DDTHH:mm:ss.SSS',
  WITHOUT_MILLISECONDS: 'YYYY-MM-DDTHH:mm:ss',
};

/**
 * Maps granularity to dayjs unit for date manipulation
 */
const granularityToDayjsUnitMap: Record<Granularity, dayjs.ManipulateType> = {
  second: 'second',
  minute: 'minute',
  hour: 'hour',
  day: 'day',
  week: 'week',
  month: 'month',
  quarter: 'month', // Will be handled specially
  year: 'year',
};

/**
 * Formats a Date object as YYYY-MM-DD string in local timezone
 */
const formatDateAsString = (date: Date): string => {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

/**
 * Formats a Date object as YYYY-MM-DD string in UTC timezone
 */
const formatDateAsStringUTC = (date: Date): string => {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
};

/**
 * Checks if a date is in UTC format (contains 'Z')
 */
const isUTCDate = (date: Date): boolean => {
  return date.toISOString().includes('Z');
};

/**
 * Formats a date string based on whether it's UTC or local
 */
const formatDateString = (date: Date): string => {
  return isUTCDate(date) ? formatDateAsStringUTC(date) : formatDateAsString(date);
};

/**
 * Gets the quarter start date for a given dayjs date
 */
const getQuarterStart = (date: dayjs.Dayjs): dayjs.Dayjs => {
  return date
    .startOf('month')
    .month(Math.floor(date.month() / 3) * 3)
    .startOf('month');
};

/**
 * Applies granularity-specific start/end logic to dates
 */
const applyGranularityBounds = (date: dayjs.Dayjs, granularity: Granularity): dayjs.Dayjs => {
  const unit = granularityToDayjsUnit(granularity);

  if (granularity === 'week') {
    return date.startOf('week');
  } else if (granularity === 'quarter') {
    return getQuarterStart(date);
  } else {
    return date.startOf(unit);
  }
};

/**
 * Resolves date bounds from dimension inputs, handling relative time strings
 */
const resolveDateBounds = (dimension: Dimension, theme?: Theme): TimeRange => {
  const dateBounds = dimension.inputs?.dateBounds;
  if (!dateBounds) return undefined;

  // If it already has from/to dates, use them directly
  if (dateBounds.from && dateBounds.to) {
    return dateBounds;
  }

  // If it has a relativeTimeString, resolve it using theme options
  const relativeTimeString = dateBounds.relativeTimeString;
  if (relativeTimeString) {
    const dateRangeOptions = theme?.defaults?.dateRangesOptions ?? [];
    const matchedOption = dateRangeOptions.find((option) => option.value === relativeTimeString);

    if (matchedOption) {
      const range = matchedOption.getRange() as TimeRangeDeserializedValue;
      return {
        from: range.from,
        to: range.to,
        relativeTimeString: relativeTimeString,
      };
    }
  }

  return undefined;
};

export type FillGapsOptions = {
  dimension: Dimension;
  granularity?: Granularity;
  sortOrder?: 'asc' | 'desc';
  dateBounds?: TimeRangeDeserializedValue;
  theme?: Theme;
};

/**
 * Fills missing time buckets in a date-series based on granularity and sorting
 *
 * @param data - Array of date records to process
 * @param options - Configuration options for gap filling
 * @returns Array with missing time buckets filled in
 *
 * @example
 * ```typescript
 * const data = [
 *   { date: '2024-01-01', value: 10 },
 *   { date: '2024-01-03', value: 20 }
 * ];
 * const result = fillGaps(data, {
 *   dimension: { name: 'date' },
 *   granularity: 'day'
 * });
 * // Result: [{ date: '2024-01-01', value: 10 }, { date: '2024-01-02', value: null }, { date: '2024-01-03', value: 20 }]
 * ```
 */
export const fillGaps = (
  data: DataResponse['data'],
  options: FillGapsOptions,
): DataResponse['data'] => {
  const { dimension, granularity = 'day', sortOrder = 'asc', dateBounds, theme } = options;

  // Resolve date bounds from dimension inputs if not provided directly
  const resolvedDateBounds = dateBounds || resolveDateBounds(dimension, theme);

  if (!data || data.length === 0) {
    return data;
  }

  if (!dimension?.name) {
    throw new Error('dimension.name is required');
  }

  // Get the dimension name - use granularity-specific name if available
  const dimensionName = getGranularityDimensionName(dimension.name, granularity, data);

  // Parse dates and filter valid ones
  const validData = data
    .map((record) => {
      const dateValue = record[dimensionName];
      if (typeof dateValue !== 'string') {
        return null;
      }
      const parsedDate = dayjs(dateValue);
      return parsedDate.isValid() ? { ...record, _parsedDate: parsedDate } : null;
    })
    .filter(
      (record): record is DataResponseDataRecord & { _parsedDate: dayjs.Dayjs } => record !== null,
    );

  if (validData.length === 0) {
    console.warn('fillGaps: No valid dates found in data');
    return data;
  }

  // Determine date range
  let minDate: dayjs.Dayjs;
  let maxDate: dayjs.Dayjs;

  if (resolvedDateBounds) {
    // Parse dates with timezone-safe approach
    const fromDate =
      resolvedDateBounds.from instanceof Date
        ? resolvedDateBounds.from
        : new Date(resolvedDateBounds.from!);
    const toDate =
      resolvedDateBounds.to instanceof Date
        ? resolvedDateBounds.to
        : new Date(resolvedDateBounds.to!);

    // For sub-day granularities, preserve time component
    if (granularity === 'second' || granularity === 'minute' || granularity === 'hour') {
      minDate = dayjs(fromDate);
      maxDate = dayjs(toDate);
    } else {
      // For day+ granularities, extract date only to avoid timezone issues
      const fromDateStr = formatDateString(fromDate);
      const toDateStr = formatDateString(toDate);

      minDate = dayjs(fromDateStr);
      maxDate = dayjs(toDateStr);
    }

    // Apply granularity-specific start/end logic
    minDate = applyGranularityBounds(minDate, granularity);
    maxDate = applyGranularityBounds(maxDate, granularity);
  } else {
    // Use data range - more efficient single pass
    const firstRecord = validData[0];
    if (!firstRecord) {
      return data;
    }

    let min = firstRecord._parsedDate;
    let max = firstRecord._parsedDate;

    for (let i = 1; i < validData.length; i++) {
      const record = validData[i];
      if (record) {
        const date = record._parsedDate;
        if (date.isBefore(min)) min = date;
        if (date.isAfter(max)) max = date;
      }
    }

    minDate = min;
    maxDate = max;
  }

  // Generate all possible dates in the range
  const allDates: dayjs.Dayjs[] = [];

  // Normalize both dates to the start of their respective granularity units
  const dayjsUnit = granularityToDayjsUnit(granularity);
  const minDateStart = minDate.startOf(dayjsUnit);
  const maxDateStart = maxDate.startOf(dayjsUnit);

  if (granularity === 'week') {
    // For week granularity, start from the first day and add exactly 7 days
    let currentDate = minDateStart;
    while (currentDate.isBefore(maxDateStart) || currentDate.isSame(maxDateStart, 'day')) {
      allDates.push(currentDate);
      currentDate = currentDate.add(7, 'day'); // Add exactly 7 days
    }
  } else {
    // For other granularities, use the standard approach
    let currentDate = minDateStart;

    while (currentDate.isBefore(maxDateStart) || currentDate.isSame(maxDateStart, dayjsUnit)) {
      allDates.push(currentDate);

      if (granularity === 'quarter') {
        currentDate = currentDate.add(3, 'month');
      } else {
        currentDate = currentDate.add(1, dayjsUnit);
      }
    }
  }

  // Create a map of existing data by date
  const existingDataMap = new Map<string, DataResponseDataRecord>();
  validData.forEach((record) => {
    const dateKey = generateDateKey(record._parsedDate);
    existingDataMap.set(dateKey, record);
  });

  // Fill gaps
  const result: DataResponse['data'] = [];
  allDates.forEach((date) => {
    const dateKey = generateDateKey(date);
    const existingRecord = existingDataMap.get(dateKey);

    if (existingRecord) {
      // Use existing data - exclude internal _parsedDate field
      const cleanRecord = { ...existingRecord };
      delete cleanRecord._parsedDate;
      result.push(cleanRecord);
    } else {
      // Create gap record with zero/null values
      // Use the same date format as the original data
      const dateFormat = getDateFormatFromSample(data);
      const formattedDate = formatDateForGapRecord(date, dateFormat);

      const gapRecord: DataResponseDataRecord = {
        [dimensionName]: formattedDate,
      };

      // Set all other dimensions to null/zero, but preserve date fields
      const baseDimensionName = dimension.name;
      const sampleRecord = data[0];
      if (sampleRecord) {
        for (const key of Object.keys(sampleRecord)) {
          if (key !== dimensionName) {
            // If this is another date dimension (same base name), use the same date
            if (key.startsWith(baseDimensionName) && key !== dimensionName) {
              gapRecord[key] = formattedDate;
            } else {
              gapRecord[key] = null;
            }
          }
        }
      }

      result.push(gapRecord);
    }
  });

  // Sort the result
  if (sortOrder === 'desc') {
    result.sort(
      (a, b) =>
        dayjs(b[dimensionName] as string).valueOf() - dayjs(a[dimensionName] as string).valueOf(),
    );
  } else {
    result.sort(
      (a, b) =>
        dayjs(a[dimensionName] as string).valueOf() - dayjs(b[dimensionName] as string).valueOf(),
    );
  }

  return result;
};

/**
 * Generates a consistent date key for mapping
 * Includes time component to support second/minute granularities
 */
const generateDateKey = (date: dayjs.Dayjs): string => {
  return date.format('YYYY-MM-DDTHH:mm:ss');
};

/**
 * Gets the correct dimension name based on granularity
 */
const getGranularityDimensionName = (
  baseDimensionName: string,
  granularity: Granularity,
  data: DataResponse['data'],
): string => {
  if (!data || data.length === 0) return baseDimensionName;

  const sampleRecord = data[0];
  if (!sampleRecord) return baseDimensionName;

  const granularityKey = `${baseDimensionName}.${granularity}`;

  // Check if granularity-specific dimension exists in the data
  if (granularityKey in sampleRecord) {
    return granularityKey;
  }

  // Fallback to base dimension name
  return baseDimensionName;
};

/**
 * Detects the date format from sample data
 */
const getDateFormatFromSample = (data: DataResponse['data']): string => {
  if (!data?.length) return DATE_FORMATS.DEFAULT;

  const sampleRecord = data[0];
  if (!sampleRecord) return DATE_FORMATS.DEFAULT;

  // Look for any date field to determine format
  for (const value of Object.values(sampleRecord)) {
    if (typeof value === 'string' && value.includes('T') && value.includes(':')) {
      if (value.endsWith('Z')) {
        return DATE_FORMATS.WITH_TIMEZONE;
      }
      if (value.includes('.')) {
        return DATE_FORMATS.WITHOUT_TIMEZONE;
      }
      return DATE_FORMATS.WITHOUT_MILLISECONDS;
    }
  }

  return DATE_FORMATS.DEFAULT;
};

/**
 * Formats a date for gap records using the detected format
 */
const formatDateForGapRecord = (date: dayjs.Dayjs, dateFormat: string): string => {
  if (dateFormat.includes('[Z]')) {
    return date.format(DATE_FORMATS.WITH_TIMEZONE);
  } else if (dateFormat.includes('.SSS')) {
    return date.format(DATE_FORMATS.WITHOUT_TIMEZONE);
  } else {
    return date.format(DATE_FORMATS.WITHOUT_MILLISECONDS);
  }
};

/**
 * Maps granularity to dayjs unit
 */
const granularityToDayjsUnit = (granularity: Granularity): dayjs.ManipulateType => {
  return granularityToDayjsUnitMap[granularity] || granularityToDayjsUnitMap.day;
};
