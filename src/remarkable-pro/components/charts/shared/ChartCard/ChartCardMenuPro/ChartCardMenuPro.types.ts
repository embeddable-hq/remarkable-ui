import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../../../theme/theme.types';

export type ChartCardMenuProOptionOnClickProps = {
  title?: string;
  data?: DataResponse['data'];
  dimensionsAndMeasures?: (Dimension | Measure)[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  theme: Theme;
};

export type ChartCardMenuProOption = {
  labelKey: string;
  iconSrc?: string;
  onClick: (props: ChartCardMenuProOptionOnClickProps) => void;
};
