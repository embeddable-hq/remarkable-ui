import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { i18nTheme } from '../../theme/i18n';

export const groupTailAsOther = (
  data: DataResponse['data'] = [],
  dimension: Dimension,
  measure: Measure,
  maxItems?: number,
) => {
  const i18n = i18nTheme();

  if (!maxItems || data.length <= maxItems) return data;

  const head = data.slice(0, maxItems - 1);
  const tail = data.slice(maxItems - 1);
  const sumTail = tail.reduce((sum, row) => sum + parseFloat(row[measure.name]), 0);

  return [
    ...head,
    {
      [dimension.name]: i18n.t('common.other') || 'Other',
      [measure.name]: sumTail,
    },
  ];
};
