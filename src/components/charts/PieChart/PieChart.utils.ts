import { ChartData, ChartOptions } from 'chart.js';
import { Theme } from 'src/theme';
import { getStyleNumber } from '../../../theme/theme.utils';

export const getDefaultData = (theme: Theme): ChartData<'pie'> => ({
  datasets: [
    {
      data: [],
      backgroundColor: theme.charts.colors,
      borderColor: theme.charts.borderColors,
    },
  ],
});

export const geDefaultOptions = (theme: Theme): Partial<ChartOptions<'pie'>> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    // TODO: check with harry - as this prop is not recognized
    // datalabels: {
    //   display: showValueLabels ? 'auto' : false,
    //   ...dataLabelOptions,
    //   anchor: 'center',
    //   align: 'center',
    //   formatter: (value: string) => formatValue(value, { typeHint: 'number', theme }),
    // },
    legend: {
      display: true,
      position: theme.charts.legendPosition,
      labels: {
        // TODO: border radius is not stylable
        borderRadius: 50,
        boxWidth: getStyleNumber('--em-category-indicator-size-width'),
        boxHeight: getStyleNumber('--em-category-indicator-size-height'),
        usePointStyle: true,
        color: theme.styles['--em-category-indicator-group-label-color-default'],
        font: {
          family: theme.styles['--em-category-indicator-group-label-family'],
          size: getStyleNumber('--em-category-indicator-group-label-font-size'),
          weight: getStyleNumber('--em-category-indicator-group-label-font-weight'),
          lineHeight: getStyleNumber('--em-category-indicator-group-label-font-line-height'),
        },
      },
    },
    tooltip: {
      caretSize: 0,
      enabled: true,
      backgroundColor: theme.styles['--em-chart-tooltip-background-color-default'],
      boxPadding: getStyleNumber('--em-chart-tooltip-padding-default'),
      cornerRadius: getStyleNumber('--em-chart-tooltip-border-radius-default'),
      padding: getStyleNumber('--em-chart-tooltip-padding-default'),
      displayColors: true,
      // TODO: wait for denis designs
      // bodyColor: theme.styles['--em-chart-tooltip-category-color'],
      // bodyAlign: theme.styles['--em-chart-tooltip-category-align'] as any,
      // bodyFont: {
      //   family: theme.styles['--em-chart-tooltip-category-family'],
      //   size: getStyle('--em-chart-tooltip-category-size') as number,
      //   weight: getStyle('--em-chart-tooltip-category-weight') as number,
      // },
      // titleAlign: theme.styles['--em-chart-tooltip-title-align'] as any,
      // titleColor: theme.styles['--em-chart-tooltip-title-color'],
      // titleFont: {
      //   family: theme.styles['--em-chart-tooltip-title-family'],
      //   size: getStyle('--em-chart-tooltip-title-size') as number,
      //   weight: getStyle('--em-chart-tooltip-title-weight') as number,
      // },
      // usePointStyle: true,
      callbacks: {
        label(tooltipItem) {
          const raw = tooltipItem.raw as number;
          const dataset = tooltipItem.dataset;
          const total = Array.isArray(dataset.data)
            ? dataset.data.reduce((sum: number, v: unknown) => sum + parseFloat(v as string), 0)
            : 0;
          const pct = total ? Math.round((raw / total) * 100) : 0;
          return `${theme.formatter.numberFormatter(theme).format(raw)} (${pct}%)`;
        },
      },
    },
  },
});
