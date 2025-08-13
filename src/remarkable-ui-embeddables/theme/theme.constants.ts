import { exportCSV, exportPNG, exportXLSX } from './utils/export.utils';
import CloudDownload from '../assets/icons/cloud-download.svg';
import PhotoDown from '../assets/icons/photo-down.svg';
import { en } from './i18n/translations/en';
import { de } from './i18n/translations/de';
import { defaultThemeFormatter } from './formatter/formatter.constants';
import { defaultThemeStyles } from './styles/styles.constants';
import { Theme } from './theme.types';

export const defaultChartsMenuOptions = [
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

export const remarkableTheme: Theme = {
  i18n: {
    language: 'en',
    translations: {
      en,
      de,
    },
  },
  charts: {
    menuOptions: defaultChartsMenuOptions,
    legendPosition: 'bottom',
  },
  formatter: defaultThemeFormatter,
  styles: defaultThemeStyles,
} as const;
