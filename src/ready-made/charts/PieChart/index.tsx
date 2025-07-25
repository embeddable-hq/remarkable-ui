//Third Party Libraries
import { ChartCard } from '../../../components/charts/ChartCard/ChartCard';
import { PieChart } from '../../../components/charts/PieChart/PieChart';
import { useTheme } from '@embeddable.com/react';
import { Theme } from 'src/theme';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartData, ChartOptions } from 'chart.js';
import { FC } from 'react';
import { groupTailAsOther } from '../../ready-made-utils/data.utils';

const getPieChartData = (
  data: DataResponse['data'],
  dimension: Dimension,
  measure: Measure,
  maxLegendItems?: number,
  theme?: Theme,
): ChartData<'pie'> => {
  const groupedData = groupTailAsOther(data, dimension, measure, maxLegendItems, theme);
  return {
    labels: groupedData.map((item) => item[dimension.name]),
    datasets: [
      {
        data: groupedData.map((item) => item[measure.name]),
      },
    ],
  };
};

const getPieChartOptions = (props: {
  showTooltips: boolean;
  showLegend: boolean;
}): Partial<ChartOptions<'pie'>> => {
  return {
    plugins: {
      legend: { display: props.showLegend },
      tooltip: { enabled: props.showTooltips },
    },
  };
};

interface PieChartProps {
  description: string;
  dimension: Dimension;
  measure: Measure;
  results: DataResponse;
  title: string;
  showTooltips: boolean;
  showLegend: boolean;
  maxLegendItems: number;
}

const ReadyMadePieChart: FC<PieChartProps> = ({
  description,
  dimension,
  measure,
  results,
  title,
  showTooltips,
  showLegend,
  maxLegendItems,
}) => {
  const theme = useTheme() as Theme;

  const data = getPieChartData(results.data ?? [], dimension, measure, maxLegendItems);
  const options = getPieChartOptions({ showTooltips, showLegend });
  const hasResults = (results.data || []).length > 0;

  return (
    <ChartCard
      errorMessage={results.error}
      hasResults={hasResults}
      isLoading={results.isLoading}
      subtitle={description}
      title={title}
    >
      <PieChart data={data} options={options} theme={theme} />
    </ChartCard>
  );
};

export default ReadyMadePieChart;
