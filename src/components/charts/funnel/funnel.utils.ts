import { ChartData, ChartOptions } from 'chart.js';
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
    const label = context.chart.data.labels?.[context.dataIndex] ?? '';
    const data = (context.chart.data.datasets[context.datasetIndex]?.data ?? []) as number[];
    const total = data.reduce((sum, v) => sum + (v || 0), 0);
    const percentage = total > 0 ? (value / total) * 100 : 0;

    const parts = [
      config.showCount ? value.toLocaleString() : undefined,
      config.showPercentages ? `${percentage.toFixed(1)}%` : undefined,
    ].filter(Boolean);

    return [label, parts.join(' · ')].filter(Boolean).join('\n');
  };

export const getFunnelChartOptions = (
  config: FunnelChartConfigurationProps,
): Partial<ChartOptions<'funnel'>> => {
  const funnelChartOptions: Partial<ChartOptions<'funnel'>> = {
    indexAxis: 'y',
    plugins: {
      legend: { display: config.showLegend },
      tooltip: { enabled: config.showTooltips },
      datalabels: {
        display: config.showCount || config.showPercentages ? 'auto' : false,
        anchor: 'center',
        align: 'center',
        formatter: getFunnelDatalabelFormatter(config),
      },
    },
  };

  return mergician(getChartjsOptions(), funnelChartOptions);
};
