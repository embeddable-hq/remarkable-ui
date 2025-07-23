import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { FC } from 'react';
import { Pie } from 'react-chartjs-2';
import { themeChartBorderColors, themeChartColors } from 'src/theme/theme.constants';

ChartJS.register(ArcElement, Tooltip, Legend);

type PieChartProps = {
  backgroundColor?: string[];
  borderColor?: string[];
  showLegend?: boolean;
  legendPosition?: 'top' | 'bottom' | 'left' | 'right';
};
export const PieChart: FC<PieChartProps> = ({
  backgroundColor = themeChartColors,
  borderColor = themeChartBorderColors,
  showLegend,
  legendPosition = 'bottom',
}) => {
  const data = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [
      {
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor,
        borderColor,
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: showLegend, position: legendPosition },
      datalabels: {
        display: 'auto',
      },
    },
  };

  return <Pie data={data} options={options} />;
};
