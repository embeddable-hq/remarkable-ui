import { FC, useRef } from 'react';
import { Pie } from 'react-chartjs-2';
import { buildChartjsOnClick } from '../../chartjs.utils';
import { useChartFontsReady } from '../../../../hooks/useChartFontsReady.hook';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import { getPieChartData, getPieChartOptions } from '../pies.utils';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { mergician } from 'mergician';
import { BasePieChartProps } from '../pies.types';
import styles from '../../charts.module.css';
import { describePieChart } from '../../chartjs.a11y.utils';
import { useChartA11y } from '../../useChartA11y.hook';

import AnnotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export type PieChartProps = BasePieChartProps;

export const PieChart: FC<PieChartProps> = ({
  data,
  options = {},
  onClick,
  showLegend = true,
  showTooltips = true,
  showValueLabels = true,
  ariaLabel,
  ariaDescription,
}) => {
  const chartRef = useRef(null);
  useChartFontsReady(chartRef);
  const { canvasProps, description } = useChartA11y({
    ariaLabel,
    ariaDescription,
    defaultLabel: 'Pie chart',
    getSummary: () => describePieChart({ type: 'pie', data }),
    summaryDeps: [data],
  });
  const pieOptions = mergician(
    getPieChartOptions({
      showLegend,
      showTooltips,
      showValueLabels,
    }),
    options,
  );

  return (
    <div className={styles.chartContainer}>
      <Pie
        ref={chartRef}
        data={getPieChartData(data)}
        options={pieOptions}
        onClick={buildChartjsOnClick(chartRef, onClick)}
        {...canvasProps}
      />
      {description}
    </div>
  );
};
