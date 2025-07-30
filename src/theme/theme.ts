import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { exportCSV, exportPNG, exportXLSX } from '../ready-made/ready-made-utils/export.utils';
import { themeFormatter } from './theme-formatter/theme-formatter';
import { ThemeFormatter } from './theme-formatter/theme-formatter.types';
import {
  themeChartBorderColors,
  themeChartColors,
  ThemeStyles,
  themeStyles,
} from './theme.constants';
import React from 'react';
import CloudDownload from '../icons/cloud-download.svg';
import PhotoDown from '../icons/photo-down.svg';

export type ThemeChartsExportOptionActionProps = {
  title?: string;
  data?: DataResponse['data'];
  dimensions?: Dimension[];
  measures?: Measure[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
};

export type Theme = {
  charts: {
    exportOptions?: {
      label: string;
      iconSrc?: string;
      action: (props: ThemeChartsExportOptionActionProps) => void;
    }[];
    colors: string[];
    borderColors?: string[];
    legendPosition: 'top' | 'right' | 'bottom' | 'left';
  };
  styles: ThemeStyles;
  formatter: ThemeFormatter;
};

export const remarkableTheme: Theme = {
  charts: {
    exportOptions: [
      {
        label: 'Download CSV',
        action: exportCSV,
        iconSrc: CloudDownload,
      },
      {
        label: 'Download XLSX',
        action: exportXLSX,
        iconSrc: CloudDownload,
      },
      {
        label: 'Download PNG',
        action: exportPNG,
        iconSrc: PhotoDown,
      },
    ],
    borderColors: themeChartBorderColors,
    colors: themeChartColors,
    legendPosition: 'bottom',
  },
  formatter: themeFormatter,
  styles: themeStyles,
} as const;
