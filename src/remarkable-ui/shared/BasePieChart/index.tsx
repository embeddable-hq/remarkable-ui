// React & Third Party Libraries
import React, { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { Pie } from 'react-chartjs-2';
import { mergician } from 'mergician';

// Embeddable Libraries
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';

// Local Libraries
import { getStyle } from '../../utils/cssUtils';
import { tooltipStyle, datalabelStyle, legendStyle } from '../../constants/commonChartStyles';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { formatValue } from '../../utils/formatUtils';

// Register ChartJS components
ChartJS.register(ArcElement, LinearScale, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

// Global font defaults. TODO: These have backups currently because sometimes the css variables aren't loaded when this is run, causing chartJS to not render. This won't be a problem when css variables are loaded at the correct time.
ChartJS.defaults.font.family = getStyle('--font-sans') as string || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
ChartJS.defaults.font.size = getStyle('--text-xs') as number || 12;
ChartJS.defaults.font.weight = 'normal';
ChartJS.defaults.color = getStyle('--foreground-default') as string || '#212129';

type BasePieChartProps = {
    chartOptionsOverrides?: Partial<ChartOptions<'pie'>>;
    dimension: Dimension;
    measure: Measure;
    results: DataResponse;
    showDataLabels?: 'auto' | true | false;
    showLegend?: boolean;
    showTooltips?: boolean;
}

const BasePieChart = ({
  chartOptionsOverrides,
  dimension,
  measure,
  results,
  showDataLabels,
  showLegend,
  showTooltips
}: BasePieChartProps ) => {

    const { data } = results; 
    const chartRef = useRef<ChartJS<'pie', number[], string> | null>(null);
    const theme = useTheme() as Theme; 

    const chartData = () => {
        return {
            labels: data?.map((item) => formatValue(item[dimension.name], { typeHint: 'string', theme: theme })) || [],
            datasets: [
                {
                    data: data?.map((item) => item[measure.name]) || [],
                    backgroundColor: theme.charts.colors.slice(0, data?.length || 0),
                    borderColor: theme.charts.borderColors.slice(0, data?.length || 0),
                    borderWidth: 1,
                    hoverBackgroundColor: theme.charts.colors.map((color:string) => color.replace('0.8', '0.9')),
                    hoverBorderColor: theme.charts.borderColors,
                    hoverBorderWidth: 2,
                }
            ],
        }
    };

    const chartOptions = () => {
        return mergician({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                datalabels: {
                    display: showDataLabels || 'auto',
                    ...datalabelStyle,
                    anchor: 'center',
                    align: 'center',
                    formatter: (value:string, context:any) => {
                        return formatValue(value, { typeHint: 'number', theme: theme });
                    },                    
                },
                legend: {
                    display: showLegend || true,
                    position: 'bottom',
                    labels: legendStyle,
                },
                tooltip: {
                    enabled: showTooltips || true,
                    ...tooltipStyle,
                    callbacks: {
                        label: function(context:any) {
                            const label = context.label || '';
                            const value = context.raw as number;
                            const total = context.dataset.data.reduce((acc:number, val:string) => acc + (parseFloat(val)), 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${formatValue(value, { typeHint: 'number', theme: theme })} (${percentage}%)`;
                        }
                    }
                }
            },
        }, chartOptionsOverrides || {}) as ChartOptions<'pie'>
    };

    return (        
        <Pie
            ref={chartRef}
            data={chartData()} 
            options={chartOptions()} 
        />
    );
};

export default BasePieChart;