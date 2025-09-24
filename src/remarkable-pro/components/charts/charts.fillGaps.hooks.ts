import { useMemo } from 'react';
import { DataResponse, Dimension, Granularity } from '@embeddable.com/core';
import { fillGaps, type DateRecord, type FillGapsOptions } from './charts.fillGaps.utils';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../theme/theme.types';

/**
 * Hook that automatically applies fillGaps to chart data when beneficial.
 *
 * This hook intelligently fills missing time buckets in date-series data based on:
 * - The granularity from dimension inputs or auto-detected granularity from data
 * - Date bounds from dimension inputs (including relative time strings)
 * - Data sparsity analysis to determine if gap filling is needed
 *
 * @param results - The data response containing the chart data
 * @param dimension - The dimension being used for the chart axis (includes granularity in inputs)
 * @returns Enhanced data with filled time gaps, or original data if no gaps need filling
 */
export const useChartDataWithFillGaps = (
  results: DataResponse,
  dimension: Dimension,
): DataResponse => {
  const theme = useTheme() as Theme;

  const data = useMemo(() => {
    const data = results.data;

    // Only apply fillGaps if:
    // 1. The dimension is a date/time dimension
    // 2. We have data to process
    if (dimension.nativeType !== 'time' || !data || data.length === 0) {
      return data;
    }

    // Get granularity from dimension inputs or auto-detect from data
    const effectiveGranularity =
      dimension.inputs?.granularity || detectGranularityFromData(data, dimension);

    if (!effectiveGranularity) {
      return data;
    }

    // Check if this looks like a sparse time series that would benefit from fillGaps
    // If dimension has date bounds, always apply fillGaps to ensure the specified range is filled
    const hasDateBounds = dimension.inputs?.dateBounds;
    const shouldApply = hasDateBounds ?? shouldApplyFillGaps(data, dimension, effectiveGranularity);

    if (!shouldApply) {
      return data;
    }

    // Use the effective granularity
    const options: FillGapsOptions = {
      dimension: dimension,
      granularity: effectiveGranularity,
      sortOrder: 'asc',
      theme: theme,
    };

    try {
      return fillGaps(data as DateRecord[], options);
    } catch (error) {
      console.warn('Failed to apply fillGaps to chart data:', error);
      return data;
    }
  }, [results.data, dimension, theme]);
  return {
    ...results,
    data,
  };
};

/**
 * Determines if fillGaps should be applied based on data characteristics.
 *
 * Analyzes the time series data to detect if there are significant gaps that would
 * benefit from gap filling. Uses the expected step size for the given granularity
 * to determine if the data appears sparse.
 *
 * @param data - The chart data to analyze
 * @param dimension - The dimension being used for the time axis
 * @param granularity - The granularity to use for gap analysis (e.g., 'day', 'week')
 * @returns True if gap filling should be applied, false otherwise
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
 * Detects granularity from data by examining dimension names in the data.
 *
 * Looks for granularity-specific dimension names (e.g., 'events.date.week')
 * to infer the appropriate granularity for gap filling. Falls back to the
 * base dimension name if no granularity-specific dimension is found.
 *
 * @param data - The chart data to analyze
 * @param dimension - The base dimension being used
 * @returns Detected granularity or null if none can be determined
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

const TIME_CONSTANTS = (() => {
  const SECOND = 1000;
  const MINUTE = 60 * SECOND;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;
  const WEEK = 7 * DAY;
  const MONTH = 30 * DAY; // Approximate
  const QUARTER = 90 * DAY; // Approximate
  const YEAR = 365 * DAY; // Approximate

  return {
    SECOND,
    MINUTE,
    HOUR,
    DAY,
    WEEK,
    MONTH,
    QUARTER,
    YEAR,
  };
})();

/**
 * Gets the expected step size in milliseconds for a given granularity.
 *
 * Returns the expected time interval between consecutive data points for
 * the specified granularity. Used to detect if there are gaps in the
 * time series data that would benefit from gap filling.
 *
 * @param granularity - The time granularity (e.g., 'day', 'week', 'month')
 * @returns Expected step size in milliseconds
 */
const getGranularityStepMs = (granularity: string): number => {
  switch (granularity) {
    case 'second':
      return TIME_CONSTANTS.SECOND;
    case 'minute':
      return TIME_CONSTANTS.MINUTE;
    case 'hour':
      return TIME_CONSTANTS.HOUR;
    case 'day':
      return TIME_CONSTANTS.DAY;
    case 'week':
      return TIME_CONSTANTS.WEEK;
    case 'month':
      return TIME_CONSTANTS.MONTH;
    case 'quarter':
      return TIME_CONSTANTS.QUARTER;
    case 'year':
      return TIME_CONSTANTS.YEAR;
    default:
      return TIME_CONSTANTS.DAY; // Default fallback
  }
};
