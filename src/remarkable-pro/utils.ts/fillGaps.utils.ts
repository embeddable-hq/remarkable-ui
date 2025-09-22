import dayjs from 'dayjs';
import { Dimension, Granularity, TimeRangeDeserializedValue } from '@embeddable.com/core';

export type DateRecord = Record<string, unknown>;

export type FillGapsOptions = {
  xAxis: Dimension;
  granularity?: Granularity;
  sortOrder?: 'asc' | 'desc';
  dateBounds?: TimeRangeDeserializedValue;
};

/**
 * Fills missing time buckets in a date-series based on granularity and sorting
 */
export const fillGaps = (data: DateRecord[], options: FillGapsOptions): DateRecord[] => {
  const { xAxis, granularity = 'day', sortOrder = 'asc', dateBounds } = options;
  console.log('fillGaps - granularity:', granularity, 'dimensionName:', xAxis.name);

  if (!data || data.length === 0) {
    return data;
  }

  // Get the dimension name - use granularity-specific name if available
  const dimensionName = getGranularityDimensionName(xAxis.name, granularity, data);
  console.log('fillGaps - using dimensionName:', dimensionName);

  // Parse dates and filter valid ones
  const validData = data
    .map((record) => ({
      ...record,
      _parsedDate: dayjs(record[dimensionName] as string),
    }))
    .filter((record) => record._parsedDate.isValid());

  if (validData.length === 0) {
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
    // Use data range
    const dates = validData.map((d) => d._parsedDate);
    minDate = dates.reduce((min, date) => (date.isBefore(min) ? date : min));
    maxDate = dates.reduce((max, date) => (date.isAfter(max) ? date : max));
  }

  // Generate all possible dates in the range
  const allDates: dayjs.Dayjs[] = [];

  if (granularity === 'week') {
    // For week granularity, start from the first existing date and add weeks
    let currentDate = minDate;
    while (currentDate.isBefore(maxDate) || currentDate.isSame(maxDate, 'day')) {
      allDates.push(currentDate);
      currentDate = currentDate.add(1, 'week');
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

  // Create a map of existing data by date (using week-based matching for week granularity)
  const existingDataMap = new Map<string, DateRecord>();
  validData.forEach((record) => {
    let dateKey: string;
    if (granularity === 'week') {
      // For week granularity, use the start of the week as the key
      dateKey = record._parsedDate.startOf('week').format('YYYY-MM-DD');
    } else {
      dateKey = record._parsedDate.format('YYYY-MM-DD');
    }
    console.log(
      'fillGaps - existing data key:',
      dateKey,
      'original date:',
      (record as DateRecord)[dimensionName],
    );
    existingDataMap.set(dateKey, record);
  });

  // Fill gaps
  const result: DateRecord[] = [];
  allDates.forEach((date) => {
    let dateKey: string;
    if (granularity === 'week') {
      // For week granularity, use the start of the week as the key
      dateKey = date.startOf('week').format('YYYY-MM-DD');
    } else {
      dateKey = date.format('YYYY-MM-DD');
    }

    const existingRecord = existingDataMap.get(dateKey);
    console.log('fillGaps - checking date:', dateKey, 'found existing:', !!existingRecord);

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
      const baseDimensionName = xAxis.name;
      Object.keys(data[0] || {}).forEach((key) => {
        if (key !== dimensionName) {
          // If this is another date dimension (same base name), use the same date
          if (key.startsWith(baseDimensionName) && key !== dimensionName) {
            gapRecord[key] = formattedDate;
          } else {
            gapRecord[key] = null;
          }
        }
      });

      console.log('fillGaps - created gap record:', gapRecord);
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
  if (sampleRecord[granularityKey] !== undefined) {
    return granularityKey;
  }

  // Fallback to base dimension name
  return baseDimensionName;
};

/**
 * Detects the date format from sample data
 */
const getDateFormatFromSample = (data: DateRecord[]): string => {
  if (!data || data.length === 0) return 'YYYY-MM-DDTHH:mm:ss.SSS';

  const sampleRecord = data[0];
  if (!sampleRecord) return 'YYYY-MM-DDTHH:mm:ss.SSS';

  // Look for any date field to determine format
  for (const [, value] of Object.entries(sampleRecord)) {
    if (typeof value === 'string' && value.includes('T') && value.includes(':')) {
      // Check if it has milliseconds and Z suffix
      if (value.includes('.') && value.endsWith('Z')) {
        return 'YYYY-MM-DDTHH:mm:ss.SSS[Z]';
      } else if (value.includes('.')) {
        return 'YYYY-MM-DDTHH:mm:ss.SSS';
      } else {
        return 'YYYY-MM-DDTHH:mm:ss';
      }
    }
  }

  return 'YYYY-MM-DDTHH:mm:ss.SSS';
};

/**
 * Formats a date for gap records using the detected format
 */
const formatDateForGapRecord = (date: dayjs.Dayjs, dateFormat: string): string => {
  if (dateFormat.includes('[Z]')) {
    return date.format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  } else if (dateFormat.includes('.SSS')) {
    return date.format('YYYY-MM-DDTHH:mm:ss.SSS');
  } else {
    return date.format('YYYY-MM-DDTHH:mm:ss');
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

  return mapping[granularity] || 'day';
};

/**
 * React hook for fillGaps
 */
export const useFillGaps = (data: DateRecord[], options: FillGapsOptions): DateRecord[] => {
  return fillGaps(data, options);
};
