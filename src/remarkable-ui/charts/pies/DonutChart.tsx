import { FC } from 'react';
import { mergician } from 'mergician';
import { BasePieChartProps } from './pies.types';
import { defaultDonutChartOptions, defaultDonutLabelChartOptions } from './pies.constants';
import { Pie } from 'react-chartjs-2';
import { ArcElement, Chart as ChartJS, Legend, Tooltip } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

export type DonutLabelChartProps = Omit<BasePieChartProps, 'variant'> & {
  label?: string;
  subLabel?: string;
};

export const DonutChart: FC<DonutLabelChartProps> = ({
  label,
  subLabel,
  options = {},
  ...props
}) => {
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

  return <Pie {...props} options={donutLabelOptions} />;
};
