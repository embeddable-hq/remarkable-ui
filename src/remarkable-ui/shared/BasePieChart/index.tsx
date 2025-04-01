
import React, { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { Pie } from 'react-chartjs-2';
import { getCSSValue } from '../../utils/cssUtils'
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { mergician } from 'mergician';
import { tooltipStyle, datalabelStyle, legendStyle } from '../../constants/chartJSElements'

// Register ChartJS components
ChartJS.register(ArcElement, LinearScale, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

// Global font defaults. TODO: These have backups currently because sometimes the css variables aren't loaded when this is run, causing chartJS to not render. This won't be a problem when css variables are loaded at the correct time.
ChartJS.defaults.font.family = getCSSValue('--font-sans') as string || '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"';
ChartJS.defaults.font.size = getCSSValue('--text-xs') as number || 12;
ChartJS.defaults.font.weight = 'normal';
ChartJS.defaults.color = getCSSValue('--foreground-default') as string || '#212129';

const CHART_COLORS = [
  'rgba(255, 99, 132, 1)',   // a vivid red
  'rgba(54, 162, 235, 1)',   // a bright blue
  'rgba(255, 206, 86, 1)',   // a sunny yellow
  'rgba(75, 192, 192, 1)',   // a refreshing green
  'rgba(153, 102, 255, 1)',  // a vibrant purple
  'rgba(255, 159, 64, 1)',   // a bold orange
  'rgba(0, 200, 83, 1)',     // a lively lime green
  'rgba(0, 150, 136, 1)',    // a strong teal
  'rgba(121, 85, 72, 1)',    // a rich brown
  'rgba(63, 81, 181, 1)'     // a deep indigo
  ];

// Border colors (slightly darker variants of the main colors)
const CHART_BORDERS = [
    'rgba(255, 99, 132, 1)',   // a vivid red
    'rgba(54, 162, 235, 1)',   // a bright blue
    'rgba(255, 206, 86, 1)',   // a sunny yellow
    'rgba(75, 192, 192, 1)',   // a refreshing green
    'rgba(153, 102, 255, 1)',  // a vibrant purple
    'rgba(255, 159, 64, 1)',   // a bold orange
    'rgba(0, 200, 83, 1)',     // a lively lime green
    'rgba(0, 150, 136, 1)',    // a strong teal
    'rgba(121, 85, 72, 1)',    // a rich brown
    'rgba(63, 81, 181, 1)'     // a deep indigo
  ];

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

    const chartData = () => {
        return {
            labels: data?.map((item) => item[dimension.name]),
            datasets: [
                {
                    data: data?.map((item) => item[measure.name]),
                    backgroundColor: CHART_COLORS.slice(0, data?.length),
                    borderColor: CHART_BORDERS.slice(0, data?.length),
                    borderWidth: 1,
                    hoverBackgroundColor: CHART_COLORS.map(color => color.replace('0.8', '0.9')),
                    hoverBorderColor: CHART_BORDERS,
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
                        return value;
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
                            return `${value} (${percentage}%)`;
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