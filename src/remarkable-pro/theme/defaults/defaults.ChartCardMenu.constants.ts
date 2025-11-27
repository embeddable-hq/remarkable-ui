import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import CloudDownload from '../../assets/icons/cloud-download.svg';
import PhotoDown from '../../assets/icons/photo-down.svg';
import { exportCSV, exportPNG, exportXLSX } from '../utils/export.utils';
import { Theme } from '../theme.types';

export type ChartCardMenuOptionOnClickProps = {
  title?: string;
  data?: DataResponse['data'];
  dimensionsAndMeasures?: (Dimension | Measure)[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  theme: Theme;
  onCustomDownload?: (props: (props: ChartCardMenuOptionOnClickProps) => void) => void;
};

export type ChartCardMenuOption = {
  labelKey: string;
  iconSrc?: string;
  onClick: (props: ChartCardMenuOptionOnClickProps) => void;
};

export const defaultChartMenuProOptions: ChartCardMenuOption[] = [
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
