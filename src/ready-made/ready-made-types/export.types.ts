import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

//This is the config object that is passed through from each component to the export function, containing the key information needed to export.
export type ExportConfig = {
  data?: DataResponse['data'];
  dimensions?: Dimension[];
  measures?: Measure[];
  title?: string;
  containerRef?: React.RefObject<HTMLDivElement | null>;
};
