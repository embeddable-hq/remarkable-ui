import { Chart, ChartData, ChartDataset, ChartOptions, LegendItem } from 'chart.js';
import { Context } from 'chartjs-plugin-datalabels';
import { mergician } from 'mergician';
import { getChartColors } from '../charts.constants';
import { getChartjsOptions } from '../chartjs.constants';

type FunnelChartConfig = {
  showLegend?: boolean;
  showTooltips?: boolean;
  showPercentage?: boolean;
};

export const getFunnelChartData = (data: ChartData<'funnel'>) => {
  const chartColors = getChartColors();
  const mergedData: ChartData<'funnel', number[], unknown> = {
    ...data,
    datasets:
      data.datasets?.map((dataset) => {
        const colors = dataset.data.map((_value, index) => chartColors[index % chartColors.length]);
        const defaultDataset = { backgroundColor: colors };
        const merged = mergician(defaultDataset, dataset) as ChartDataset<'funnel'>;
        return merged;
      }) || [],
  };
  return mergedData;
};

const getFunnelDatalabelFormatter =
  (config: FunnelChartConfig) => (value: number, context: Context) => {
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
  config: FunnelChartConfig,
): Partial<ChartOptions<'funnel'>> => {
  const funnelChartOptions: Partial<ChartOptions<'funnel'>> = {
    indexAxis: 'y',
    plugins: {
      legend: {
        display: config.showLegend,
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
