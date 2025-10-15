import { DataResponse, Dimension } from '@embeddable.com/core';
import dayjs, { QUnitType } from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek.js';
import utc from 'dayjs/plugin/utc.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';

dayjs.extend(utc);
dayjs.extend(isoWeek);
dayjs.extend(isSameOrBefore);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataRecord = { [key: string]: any };

type UseFillGapsProps = {
  results: DataResponse;
  dimension: Dimension;
  orderDirection?: 'asc' | 'desc';
};

export const useFillGaps = ({
  results,
  dimension,
  orderDirection = 'asc',
}: UseFillGapsProps): DataResponse => {
  const granularity = dimension.inputs?.granularity ?? 'day';
  const dimensionName = dimension.name;
  const dateBounds = dimension.inputs?.dateBounds;

  if (dimension.nativeType !== 'time' || !dateBounds) return results;

  const from = dayjs.utc(dateBounds.from);
  const to = dayjs.utc(dateBounds.to);

  // Step 1 — Sort ascending
  const sortedResults = [...(results.data ?? [])].sort((a, b) => {
    const aVal = a[dimensionName];
    const bVal = b[dimensionName];
    if (aVal == null) return 1;
    if (bVal == null) return -1;
    return dayjs.utc(aVal).diff(dayjs.utc(bVal));
  });

  // Step 2 — Group records by date key
  const recordsByDate = new Map<string, DataRecord[]>();
  for (const record of sortedResults) {
    const value = record[dimensionName];
    if (value == null) continue;
    const key = dayjs.utc(value).toISOString().split('Z')[0]!;
    const arr = recordsByDate.get(key) ?? [];
    arr.push(record);
    recordsByDate.set(key, arr);
  }

  // Step 3 — Fill gaps
  const filled: DataRecord[] = [];
  let current = from.startOf((granularity === 'week' ? 'isoWeek' : granularity) as QUnitType);

  while (current.isSameOrBefore(to)) {
    const key = current.toISOString().split('Z')[0]!;
    const records = recordsByDate.get(key);

    if (records && records.length > 0) {
      filled.push(...records); // Add all records for this date
    } else {
      filled.push({ [dimensionName]: key }); // Add gap entry
    }

    current = current.add(1, granularity as QUnitType);
  }

  // Step 4 — Apply order direction
  if (orderDirection === 'desc') {
    filled.reverse();
  }

  return {
    ...results,
    data: filled,
  };
};
