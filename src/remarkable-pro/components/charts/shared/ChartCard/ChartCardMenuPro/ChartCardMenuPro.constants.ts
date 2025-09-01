import { exportCSV, exportPNG, exportXLSX } from '../../../../../theme/utils/export.utils';

import CloudDownload from '../../../../../assets/icons/cloud-download.svg';
import PhotoDown from '../../../../../assets/icons/photo-down.svg';
import { ChartCardMenuProOption } from './ChartCardMenuPro.types';

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
