import { FC, useRef } from 'react';
import { mergician } from 'mergician';
import { BasePieChartProps } from './pies.types';
import { defaultDonutChartOptions, defaultDonutLabelChartOptions } from './pies.constants';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { getPieData, getPieSegmentIndexClicked } from './pies.utils';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export type DonutLabelChartProps = BasePieChartProps &
  (
    | {
        label: string;
        subLabel?: string;
      }
    | {
        label?: string;
        subLabel: string;
      }
  );

export const DonutChart: FC<DonutLabelChartProps> = ({
  label,
  subLabel,
  options = {},
  data,
  onSegmentClick,
}) => {
  const chartRef = useRef(null);

  const isDonutLabel = Boolean(label || subLabel);

  const donutLabelOptions = mergician(
    isDonutLabel
      ? {
          plugins: {
            annotation: {
              annotations: {
                innerlabel: {
                  content: [label, subLabel],
                },
              },
            },
          },
        }
      : {},
    isDonutLabel ? defaultDonutLabelChartOptions : defaultDonutChartOptions,
    options,
  );

  const handleSegmentClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const indexClicked = getPieSegmentIndexClicked(event, chartRef);
    onSegmentClick?.(indexClicked);
  };

  return (
    <Pie
      ref={chartRef}
      data={getPieData(data)}
      options={donutLabelOptions}
      onClick={handleSegmentClick}
    />
  );
};
