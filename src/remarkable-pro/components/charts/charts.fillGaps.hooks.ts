import { DataResponse, Dimension, TimeRange } from '@embeddable.com/core';
import dayjs, { QUnitType } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import utc from 'dayjs/plugin/utc.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';
import { Theme } from '../../theme/theme.types';
import { useTheme } from '@embeddable.com/react';
import { useMemo } from 'react';
import quarterOfYear from 'dayjs/plugin/quarterOfYear.js';

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);
dayjs.extend(quarterOfYear);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRecord = { [key: string]: any };

type UseFillGapsProps = {
  results: DataResponse | undefined;
  dimension: Dimension;
  orderDirection?: 'asc' | 'desc';
  externalDateBounds?: TimeRange;
};

export function useFillGaps(props: UseFillGapsProps): DataResponse {
  const theme = useTheme() as Theme;
  const { results, dimension, orderDirection = 'asc', externalDateBounds } = props;

  const processed = useMemo(() => {
    const granularity = dimension.inputs?.granularity;
    const dimensionName = dimension.name;
    const dateBoundsTmp: TimeRange = dimension.inputs?.dateBounds;

    if (!granularity || !dimensionName || results?.isLoading) return results;

    const dateBounds = dateBoundsTmp?.relativeTimeString
      ? theme.defaults.dateRangesOptions
          .find((option) => option.value === dateBoundsTmp?.relativeTimeString)
          ?.getRange()
      : dateBoundsTmp;

    if (dimension.nativeType !== 'time') return results;

    const sortedResults = [...(results?.data ?? [])].sort((a, b) => {
      const aVal = a[dimensionName];
      const bVal = b[dimensionName];
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      return dayjs.utc(aVal).diff(dayjs.utc(bVal));
    });

    // Determine the full date range even if data is empty
    const from = dayjs.utc(
      externalDateBounds?.from ?? dateBounds?.from ?? sortedResults[0]?.[dimensionName],
    );

    const to = dayjs.utc(
      externalDateBounds?.to ??
        dateBounds?.to ??
        sortedResults[sortedResults.length - 1]?.[dimensionName] ??
        [...sortedResults].reverse().find((item) => item?.[dimensionName] != null)?.[dimensionName],
    );

    // If we *still* don’t have valid date bounds, bail out safely
    if (!from.isValid() || !to.isValid()) {
      return { ...results, data: [] };
    }

    const recordsByDate = new Map<string, DataRecord[]>();
    for (const record of sortedResults) {
      const value = record[dimensionName];
      if (value == null) continue;
      const key = dayjs.utc(value).toISOString().split('Z')[0]!;
      const arr = recordsByDate.get(key) ?? [];
      arr.push(record);
      recordsByDate.set(key, arr);
    }

    const filled: DataRecord[] = [];
    let current = from.startOf((granularity === 'week' ? 'isoWeek' : granularity) as QUnitType);

    while (current.isSameOrBefore(to)) {
      const key = current.toISOString().split('Z')[0]!;
      const records = recordsByDate.get(key);

      if (records && records.length > 0) {
        filled.push(...records);
      } else {
        filled.push({ [dimensionName]: key });
      }

      current = current.add(1, granularity as QUnitType);
    }

    if (orderDirection === 'desc') {
      filled.reverse();
    }

    return {
      ...results,
      data: filled,
    };
  }, [results, dimension, orderDirection, theme]);

  return processed as DataResponse;
}
