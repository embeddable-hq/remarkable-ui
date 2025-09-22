import dayjs from 'dayjs';
import { Dimension, Granularity, TimeRangeDeserializedValue } from '@embeddable.com/core';

export type DateRecord = Record<string, unknown>;

const DATE_FORMATS = {
  DEFAULT: 'YYYY-MM-DDTHH:mm:ss.SSS',
  WITH_TIMEZONE: 'YYYY-MM-DDTHH:mm:ss.SSS[Z]',
  WITHOUT_TIMEZONE: 'YYYY-MM-DDTHH:mm:ss.SSS',
  WITHOUT_MILLISECONDS: 'YYYY-MM-DDTHH:mm:ss',
} as const;

export type FillGapsOptions = {
  dimension: Dimension;
  granularity?: Granularity;
  sortOrder?: 'asc' | 'desc';
  dateBounds?: TimeRangeDeserializedValue;
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
export const fillGaps = (data: DateRecord[], options: FillGapsOptions): DateRecord[] => {
  const { dimension, granularity = 'day', sortOrder = 'asc', dateBounds } = options;

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
    .filter((record): record is DateRecord & { _parsedDate: dayjs.Dayjs } => record !== null);

  if (validData.length === 0) {
    console.warn('fillGaps: No valid dates found in data');
    return data;
  }

  // Determine date range
  let minDate: dayjs.Dayjs;
  let maxDate: dayjs.Dayjs;

  if (dateBounds) {
    if (typeof dateBounds === 'string') {
      // Handle relative time strings like "last 30 days"
      const relativeMatch = (dateBounds as string).match(
        /last\s+(\d+)\s+(day|week|month|quarter|year)s?/i,
      );
      if (relativeMatch && relativeMatch[1] && relativeMatch[2]) {
        const amount = parseInt(relativeMatch[1]);
        const unit = relativeMatch[2] as dayjs.ManipulateType;
        maxDate = dayjs();
        minDate = maxDate.subtract(amount, unit);
      } else {
        // Fallback to parsing as date range
        const [from, to] = (dateBounds as string).split(' to ');
        minDate = dayjs(from);
        maxDate = dayjs(to);
      }
    } else {
      minDate = dayjs((dateBounds as DateRecord).from as string);
      maxDate = dayjs((dateBounds as DateRecord).to as string);
    }
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

  if (granularity === 'week') {
    // For week granularity, start from the first existing date and add exactly 7 days
    let currentDate = minDate;
    while (currentDate.isBefore(maxDate) || currentDate.isSame(maxDate, 'day')) {
      allDates.push(currentDate);
      currentDate = currentDate.add(7, 'day'); // Add exactly 7 days
    }
  } else {
    // For other granularities, use the standard approach
    const dayjsUnit = granularityToDayjsUnit(granularity);
    let currentDate = minDate.startOf(dayjsUnit);
    while (currentDate.isBefore(maxDate) || currentDate.isSame(maxDate, dayjsUnit)) {
      allDates.push(currentDate);

      if (granularity === 'quarter') {
        currentDate = currentDate.add(3, 'month');
      } else {
        currentDate = currentDate.add(1, dayjsUnit);
      }
    }
  }

  // Create a map of existing data by date
  const existingDataMap = new Map<string, DateRecord>();
  validData.forEach((record) => {
    const dateKey = generateDateKey(record._parsedDate);
    existingDataMap.set(dateKey, record);
  });

  // Fill gaps
  const result: DateRecord[] = [];
  allDates.forEach((date) => {
    const dateKey = generateDateKey(date);
    const existingRecord = existingDataMap.get(dateKey);

    if (existingRecord) {
      // Use existing data
      const { ...cleanRecord } = existingRecord;
      result.push(cleanRecord);
    } else {
      // Create gap record with zero/null values
      // Use the same date format as the original data
      const dateFormat = getDateFormatFromSample(data);
      const formattedDate = formatDateForGapRecord(date, dateFormat);

      const gapRecord: DateRecord = {
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
  data: DateRecord[],
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
const getDateFormatFromSample = (data: DateRecord[]): string => {
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
  const mapping: Record<Granularity, dayjs.ManipulateType> = {
    second: 'second',
    minute: 'minute',
    hour: 'hour',
    day: 'day',
    week: 'week',
    month: 'month',
    quarter: 'month', // Will be handled specially
    year: 'year',
  };

  return mapping[granularity] || granularityToDayjsUnit('day');
};
