import { useState } from 'react';
import { ChartData } from 'chart.js';
import { ChartClickArgs } from '../charts.types';
import {
  getFunnelChartVisibleData,
  getFunnelLegendOptions,
  getOriginalFunnelItems,
} from './funnel.sections.utils';

export const useFunnelHiddenSections = (
  data: ChartData<'funnel', number[], unknown>,
  onClick?: (args: ChartClickArgs) => void,
) => {
  const [hiddenLabels, setHiddenLabels] = useState<Set<string>>(new Set());

  const sectionLabels = (data.labels ?? []).map((label) => String(label ?? ''));
  const hiddenSections = new Set(
    sectionLabels.flatMap((label, index) => (hiddenLabels.has(label) ? [index] : [])),
  );

  const handleSectionToggle = (index: number) => {
    const label = sectionLabels[index] ?? '';
    setHiddenLabels((prev) => {
      const next = new Set(prev);
      if (next.has(label)) {
        next.delete(label);
      } else {
        next.add(label);
      }
      return next;
    });
  };

  const handleClick =
    onClick &&
    ((args: ChartClickArgs) =>
      onClick({
        ...args,
        elementAtEvent: getOriginalFunnelItems(args.elementAtEvent, hiddenSections),
        elementsAtEvent: getOriginalFunnelItems(args.elementsAtEvent, hiddenSections),
        datasetAtEvent: getOriginalFunnelItems(args.datasetAtEvent, hiddenSections),
      }));

  return {
    visibleData: getFunnelChartVisibleData(data, hiddenSections),
    legendOptions: getFunnelLegendOptions({
      data,
      hiddenSections,
      onToggleSection: handleSectionToggle,
    }),
    handleClick,
  };
};
