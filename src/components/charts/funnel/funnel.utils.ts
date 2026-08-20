import { Chart, ChartData, ChartOptions, LegendItem } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { mergician } from 'mergician';
import { getChartColors } from '../charts.constants';
import { getChartjsOptions } from '../chartjs.constants';
import { FunnelChartConfigurationProps } from './funnel.types';

export const getFunnelChartData = (data: ChartData<'funnel'>): ChartData<'funnel'> => {
  const chartColors = getChartColors();
  return {
    ...data,
    datasets:
      data.datasets?.map((dataset) => {
        const colors = dataset.data.map((_value, index) => chartColors[index % chartColors.length]);
        const defaultDataset = { backgroundColor: colors };
        return mergician(defaultDataset, dataset) as typeof dataset;
      }) || [],
  };
};

const getFunnelDatalabelFormatter =
  (config: FunnelChartConfigurationProps) => (value: number, context: Context) => {
    const data = (context.chart.data.datasets[context.datasetIndex]?.data ?? []) as number[];
    const total = data.reduce((sum, v) => sum + (v || 0), 0);
    const percentage = total > 0 ? (value / total) * 100 : 0;

    return config.showPercentage ? `${percentage.toFixed(1)}%` : value.toLocaleString();
  };

const getFunnelLegendLabels = (chart: Chart<'funnel'>): LegendItem[] => {
  const colors = (chart.data.datasets[0]?.backgroundColor as string[]) ?? [];
  return (chart.data.labels ?? []).map((label, index) => ({
    text: String(label ?? ''),
    fillStyle: colors[index],
    strokeStyle: colors[index],
    index,
  }));
};

export const getFunnelChartOptions = (
  config: FunnelChartConfigurationProps,
): Partial<ChartOptions<'funnel'>> => {
  const funnelChartOptions: Partial<ChartOptions<'funnel'>> = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: config.showLegend,
        position: config.legendPosition,
        labels: { generateLabels: getFunnelLegendLabels },
      },
      tooltip: { enabled: config.showTooltips },
      datalabels: {
        display: 'auto',
        anchor: 'start',
        align: 'center',
        textAlign: 'center',
        formatter: getFunnelDatalabelFormatter(config),
      },
    },
  };

  return mergician(getChartjsOptions(), funnelChartOptions);
};
