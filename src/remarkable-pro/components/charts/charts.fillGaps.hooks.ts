import { useMemo } from 'react';
import { DataResponse, Dimension, Granularity } from '@embeddable.com/core';
import { fillGaps, type DateRecord, type FillGapsOptions } from '../../utils.ts/fillGaps.utils';

/**
 * Hook that automatically applies fillGaps to chart data when beneficial
 */
export const useChartDataWithFillGaps = (
  results: DataResponse,
  dimension: Dimension,
  granularity?: Granularity,
): DataResponse['data'] => {
  return useMemo(() => {
    const data = results.data;

    // Only apply fillGaps if:
    // 1. The dimension is a date/time dimension
    // 2. We have data to process
    if (dimension.nativeType !== 'time' || !data || data.length === 0) {
      return data;
    }

    // Auto-detect granularity from data if not provided
    const detectedGranularity = granularity || detectGranularityFromData(data, dimension);

    if (!detectedGranularity) {
      return data;
    }

    // Check if this looks like a sparse time series that would benefit from fillGaps
    if (!shouldApplyFillGaps(data, dimension, detectedGranularity)) {
      return data;
    }

    // Use the detected or provided granularity
    const options: FillGapsOptions = {
      dimension: dimension,
      granularity: detectedGranularity,
      sortOrder: 'asc',
    };

    try {
      return fillGaps(data as DateRecord[], options);
    } catch (error) {
      console.warn('Failed to apply fillGaps to chart data:', error);
      return data;
    }
  }, [results.data, dimension, granularity]);
};

/**
 * Determines if fillGaps should be applied based on data characteristics
 */
const shouldApplyFillGaps = (
  data: DataResponse['data'],
  dimension: Dimension,
  granularity: string,
): boolean => {
  if (!data || data.length < 2) {
    return false; // Too few data points
  }

  const dimensionName = dimension.name;
  const dates = data
    .map((record) => record[dimensionName])
    .filter(Boolean)
    .map((dateStr) => new Date(dateStr as string))
    .filter((date) => !isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());

  if (dates.length < 2) {
    return false; // Not enough valid dates
  }

  // Calculate expected step size based on granularity
  const expectedStepMs = getGranularityStepMs(granularity);

  // Check if there are gaps larger than expected step
  for (let i = 1; i < dates.length; i++) {
    const currentDate = dates[i];
    const previousDate = dates[i - 1];
    if (currentDate && previousDate) {
      const actualStep = currentDate.getTime() - previousDate.getTime();
      // If actual step is more than 1.5x the expected step, we have a gap
      if (actualStep > expectedStepMs * 1.5) {
        return true;
      }
    }
  }

  return false;
};

/**
 * Detects granularity from data by looking at dimension names
 */
const detectGranularityFromData = (
  data: DataResponse['data'],
  dimension: Dimension,
): Granularity | null => {
  if (!data || data.length === 0) return null;

  const sampleRecord = data[0];
  if (!sampleRecord) return null;

  const baseDimensionName = dimension.name;

  // Look for granularity-specific dimension names in the data
  const granularityKeys = Object.keys(sampleRecord).filter(
    (key) => key.startsWith(baseDimensionName) && key !== baseDimensionName,
  );

  // Check for common granularity patterns
  for (const key of granularityKeys) {
    if (key.includes('.second')) return 'second';
    if (key.includes('.minute')) return 'minute';
    if (key.includes('.hour')) return 'hour';
    if (key.includes('.day')) return 'day';
    if (key.includes('.week')) return 'week';
    if (key.includes('.month')) return 'month';
    if (key.includes('.quarter')) return 'quarter';
    if (key.includes('.year')) return 'year';
  }

  // If no granularity-specific dimension found, return null
  return null;
};

/**
 * Gets the expected step size in milliseconds for a given granularity
 */
const getGranularityStepMs = (granularity: string): number => {
  const oneSecond = 1000;
  const oneMinute = 60 * oneSecond;
  const oneHour = 60 * oneMinute;
  const oneDay = 24 * oneHour;
  const oneWeek = 7 * oneDay;
  const oneMonth = 30 * oneDay; // Approximate
  const oneQuarter = 90 * oneDay; // Approximate
  const oneYear = 365 * oneDay; // Approximate

  switch (granularity) {
    case 'second':
      return oneSecond;
    case 'minute':
      return oneMinute;
    case 'hour':
      return oneHour;
    case 'day':
      return oneDay;
    case 'week':
      return oneWeek;
    case 'month':
      return oneMonth;
    case 'quarter':
      return oneQuarter;
    case 'year':
      return oneYear;
    default:
      return oneDay; // Default fallback
  }
};
