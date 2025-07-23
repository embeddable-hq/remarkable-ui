import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, ChartData } from 'chart.js';
import { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import { remarkableTheme, Theme } from 'src/theme/theme';
import { mergician } from 'mergician';
import { getStyle } from 'src/theme/theme.utils';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  data: ChartData<'pie'>;
  options?: Partial<ChartOptions<'pie'>>;
  theme: Theme;
};

const getDefaultData = (theme: Theme): ChartData<'pie'> => ({
  datasets: [
    {
      backgroundColor: theme.charts.colors,
      borderColor: theme.charts.borderColors,
      // TODO: check if this is needed
      // borderWidth: 1,
    } as any,
  ],
});

const geDefaultOptions = (theme: Theme): Partial<ChartOptions<'pie'>> => ({
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
      // TODO: check this doesn't exist
      // labels: {
      //   boxHeight: getStyle('--em-cat-indicator-width') as number, // check a better way
      //   boxWidth: getStyle('--em-cat-indicator-height') as number,
      //   usePointStyle: true,
      //   color: theme.styles['--em-cat-name-color'],
      //   font: {
      //     // family: theme.styles['--em-cat-name-family'],
      //     // TODO: check this doesnt exist
      //     // size: getStyle('--em-cat-name-size') as number,
      //     // weight: getStyle('--em-cat-name-weight') as number,
      //   },
      // },
    },
    tooltip: {
      enabled: true,
      backgroundColor: theme.styles['--em-chart-tooltip-background'],
      bodyAlign: theme.styles['--em-chart-tooltip-category-align'] as any,
      bodyColor: theme.styles['--em-chart-tooltip-category-color'],
      bodyFont: {
        family: theme.styles['--em-chart-tooltip-category-family'],
        size: getStyle('--em-chart-tooltip-category-size') as number,
        weight: getStyle('--em-chart-tooltip-category-weight') as number,
      },
      boxPadding: getStyle('--em-chart-tooltip-gap') as number,
      cornerRadius: getStyle('--em-chart-tooltip-radius') as number,
      displayColors: true,
      padding: getStyle('--em-chart-tooltip-padding') as number,
      titleAlign: theme.styles['--em-chart-tooltip-title-align'] as any,
      titleColor: theme.styles['--em-chart-tooltip-title-color'],
      titleFont: {
        family: theme.styles['--em-chart-tooltip-title-family'],
        size: getStyle('--em-chart-tooltip-title-size') as number,
        weight: getStyle('--em-chart-tooltip-title-weight') as number,
      },
      usePointStyle: true,
      // callbacks: {
      // label(context: any) {
      //   const raw = context.raw as number;
      //   const total = context.dataset.data.reduce(
      //     (sum: number, v: any) => sum + parseFloat(v),
      //     0,
      //   );
      //   const pct = Math.round((raw / total) * 100);
      //   return `${formatValue(raw, { typeHint: 'number', theme })} (${pct}%)`;
      // },
      // },
    },
  },
});

export const PieChart: FC<PieChartProps> = ({ data, options, theme = remarkableTheme }) => {
  const mergedData = {
    ...data,
    datasets:
      data.datasets?.map((dataset, index) =>
        mergician(getDefaultData(theme).datasets?.[index] || {}, dataset),
      ) || [],
  } as ChartData<'pie'>;

  const mergedOptions = mergician(geDefaultOptions(theme), options || {});

  return <Pie data={mergedData} options={mergedOptions} />;
};
