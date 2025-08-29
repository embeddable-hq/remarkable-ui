import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Resource } from 'i18next';
import { ThemeFormatter } from './formatter/formatter.types';
import { ThemeStyles } from './styles/styles.types';
import { ChartOptions } from 'chart.js';

export type ThemeChartsMenuOptionActionProps = {
  title?: string;
  data?: DataResponse['data'];
  dimensionsAndMeasures?: (Dimension | Measure)[];
  containerRef?: React.RefObject<HTMLDivElement | null>;
  theme: Theme;
};

export type ThemeChartsMenuOption = {
  labelKey: string;
  iconSrc?: string;
  onClick: (props: ThemeChartsMenuOptionActionProps) => void;
};

export type ThemeChartsLegendPosition = 'top' | 'right' | 'bottom' | 'left';

export type Theme = {
  i18n: { language: string; translations: Resource };
  charts: {
    pieChartOverrides?: Partial<ChartOptions<'pie'>>;
    donutChartOverrides?: Partial<ChartOptions<'pie'>>;
    donutLabelChartOverrides?: Partial<ChartOptions<'pie'>>;
    menuOptions: readonly ThemeChartsMenuOption[];
    legendPosition: ThemeChartsLegendPosition;
    backgroundColors?: string[];
    borderColors?: string[];
  };
  styles: ThemeStyles;
  formatter: ThemeFormatter;
  editors?: {
    // TODO: add proper types
    dateTimeSelectFieldOverrides?: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      options?: any[];
    };
  };
};
