import { exportCSV, exportPNG, exportXLSX } from '../ready-made/ready-made-utils/export.utils';
import { themeFormatter } from './theme-formatter/theme-formatter';
import { ThemeFormatter } from './theme-formatter/theme-formatter.types';
import {
  themeChartBorderColors,
  themeChartColors,
  ThemeStyles,
  themeStyles,
} from './theme.constants';
// import { IconCloudDownload, IconFileTypePng, IconFileTypeXls } from '@tabler/icons-react';

export type Theme = {
  charts: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    exportOptions?: { label: string; icon?: any; action: (props: any) => void }[];
    colors: string[];
    borderColors?: string[];
    legendPosition: 'top' | 'right' | 'bottom' | 'left';
  };
  // TODO: add as we go
  styles: ThemeStyles;
  formatter: ThemeFormatter;
};

export const remarkableTheme: Theme = {
  charts: {
    exportOptions: [
      {
        label: 'Download CSV',
        action: exportCSV,
        icon: 'ola',
        // icon: <IconCloudDownload />,
      },
      {
        label: 'Download XLSX',
        action: exportXLSX,
        // icon: <IconFileTypeXls />,
        icon: 'adeus',
      },
      {
        label: 'Download PNG',
        action: exportPNG,
        icon: 'test1',
        // icon: <IconFileTypePng />,
      },
    ],
    borderColors: themeChartBorderColors,
    colors: themeChartColors,
    legendPosition: 'bottom',
  },
  formatter: themeFormatter,
  styles: themeStyles,
} as const;
