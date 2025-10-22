import { ChartDataset, ChartOptions, InteractionItem } from 'chart.js';

export type LineChartProOptionsClickArg = {
  dimensionValue: string | number | null;
  groupingDimensionValue?: string | boolean | null;
};
export type LineChartProOptionsClick = (arg: LineChartProOptionsClickArg) => void;

type LineDataset = ChartDataset<'line'> & {
  rawLabel?: string;
};

export const getLineChartProOptions = (props: {
  onLineClicked: LineChartProOptionsClick;
}): ChartOptions<'line'> => {
  const { onLineClicked } = props;
  return {
    onClick: (event, _elements, chart) => {
      const native = (event as unknown as { native?: Event }).native ?? (event as unknown as Event);

      // 1. Resolve the X-axis slice (all datasets at the same X)
      const slice = chart.getElementsAtEventForMode(native, 'x', { intersect: false }, false);

      if (!slice?.length) {
        onLineClicked({
          dimensionValue: null,
          groupingDimensionValue: null,
        });
        return;
      }

      const xIndex = slice[0]!.index;
      const dimensionValue = (chart.data.labels?.[xIndex] ?? null) as string | number | null;

      // 2. Resolve the specific series (group) via nearest point
      let nearest: InteractionItem | undefined = chart.getElementsAtEventForMode(
        native,
        'nearest',
        { intersect: true },
        false,
      )[0];

      // If nearest is missing or points to a different X, fall back to an element in the slice
      if (!nearest || nearest.index !== xIndex) {
        nearest = slice.find((el) => {
          const ds: LineDataset = chart.data.datasets[el.datasetIndex] as LineDataset;
          const val = Array.isArray(ds?.data) ? ds.data[xIndex] : undefined;
          return val !== null && val !== undefined;
        });
      }

      // 3. Compute the grouping key with the requested fallbacks
      let groupingDimensionValue; // default when X is found but no nearest

      if (!nearest) {
        // No nearest even after fallback — keep false to signal "no series picked"
        // (axisDimensionValue is valid because slice existed)
      } else {
        const ds: LineDataset = chart.data.datasets[nearest.datasetIndex] as LineDataset;
        groupingDimensionValue = (ds?.rawLabel ?? null) as string | boolean | null;
      }

      onLineClicked({
        dimensionValue,
        groupingDimensionValue,
      });
    },
  };
};
