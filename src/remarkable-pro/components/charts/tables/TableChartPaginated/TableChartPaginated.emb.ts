import { loadData, OrderBy, OrderDirection } from '@embeddable.com/core';
import { defineComponent, EmbeddedComponentMeta, Inputs } from '@embeddable.com/react';
import TablePaginatedChart from './index';
import {
  dataset,
  description,
  title,
  dimensionsAndMeasures,
  subInputWidth,
  subInputAlign,
  genericBoolean,
} from '../../../component.constants';

export const meta = {
  name: 'TableChartPaginated',
  label: 'Table Chart - Paginated',
  category: 'Table Charts',
  inputs: [
    dataset,
    {
      ...dimensionsAndMeasures,
      label: 'Columns',
      inputs: [...dimensionsAndMeasures.inputs, subInputWidth, subInputAlign],
    },
    title,
    description,
    { ...genericBoolean, name: 'showIndex', label: 'Show Index Column', defaultValue: true },
  ],
} as const satisfies EmbeddedComponentMeta;

type TablePaginatedChartState = {
  page: number;
  pageSize: number;
  sort: { id: string; direction: OrderDirection } | undefined;
};

export default defineComponent(TablePaginatedChart, meta, {
  /* @ts-expect-error - to be fixed in @embeddable.com/react */
  props: (
    inputs: Inputs<typeof meta>,
    [state, setState]: [TablePaginatedChartState, (state: TablePaginatedChartState) => void],
  ) => {
    const orderDimensionAndMeasure = inputs.dimensionsAndMeasures.find(
      (x) => x.name === state?.sort?.id,
    );
    const orderBy: OrderBy[] = orderDimensionAndMeasure
      ? [{ property: orderDimensionAndMeasure, direction: state.sort!.direction as OrderDirection }]
      : [];

    return {
      ...inputs,
      page: state?.page,
      pageSize: state?.pageSize,
      sort: state?.sort,
      setPage: (page: number) => setState({ ...state, page }),
      setPageSize: (pageSize: number) => setState({ ...state, pageSize }),
      setSort: (sort: { id: string; direction: OrderDirection }) => setState({ ...state, sort }),
      results: state?.pageSize
        ? loadData({
            from: inputs.dataset,
            select: inputs.dimensionsAndMeasures,
            offset: state.page * state.pageSize,
            limit: state.pageSize,
            countRows: true,
            orderBy,
          })
        : undefined,
    };
  },
});
