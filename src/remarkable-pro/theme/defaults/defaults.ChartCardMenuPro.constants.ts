import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import CloudDownload from '../../assets/icons/cloud-download.svg';
import PhotoDown from '../../assets/icons/photo-down.svg';
import { exportCSV, exportPNG, exportXLSX } from '../utils/export.utils';
import { Theme } from '../theme.types';

export type ChartCardMenuProOptionOnClickProps = {
  title?: string;
  data?: DataResponse['data'];
  dimensionsAndMeasures?: (Dimension | Measure)[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  theme: Theme;
  onCustomDownload?: (props: (props: ChartCardMenuProOptionOnClickProps) => void) => void;
};

export type ChartCardMenuProOption = {
  labelKey: string;
  iconSrc?: string;
  onClick: (props: ChartCardMenuProOptionOnClickProps) => void;
};

export const defaultChartMenuProOptions: ChartCardMenuProOption[] = [
  {
    labelKey: 'charts.menuOptions.downloadCSV',
    onClick: exportCSV,
    iconSrc: CloudDownload,
  },
  {
    labelKey: 'charts.menuOptions.downloadXLSX',
    onClick: exportXLSX,
    iconSrc: CloudDownload,
  },
  {
    labelKey: 'charts.menuOptions.downloadPNG',
    onClick: exportPNG,
    iconSrc: PhotoDown,
  },
] as const;
