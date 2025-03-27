
import React, { useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions, LinearScale } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { getCSSValue } from '../../utils/cssUtils'
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { mergician } from 'mergician';

// Register ChartJS components
ChartJS.register(ArcElement, LinearScale, Tooltip, Legend);

// Define chart colors
const CHART_COLORS = [
  'rgba(160, 215, 231, 0.8)', // blue
  'rgba(207, 200, 255, 0.8)', // indigo
  'rgba(177, 181, 245, 0.8)', // purple
  'rgba(228, 184, 226, 0.8)', // pink
  'rgba(246, 195, 197, 0.8)', // red
  'rgba(248, 212, 176, 0.8)', // orange
  'rgba(249, 227, 159, 0.8)', // yellow
  'rgba(181, 228, 202, 0.8)', // green
  'rgba(160, 215, 207, 0.8)', // teal
  'rgba(160, 215, 231, 0.8)', // cyan
];

// Border colors (slightly darker variants of the main colors)
const CHART_BORDERS = [
  'rgba(160, 215, 231, 1)',
  'rgba(207, 200, 255, 1)',
  'rgba(177, 181, 245, 1)',
  'rgba(228, 184, 226, 1)',
  'rgba(246, 195, 197, 1)',
  'rgba(248, 212, 176, 1)',
  'rgba(249, 227, 159, 1)',
  'rgba(181, 228, 202, 1)',
  'rgba(160, 215, 207, 1)',
  'rgba(160, 215, 231, 1)',
];

type BasePieChartProps = {
    measure: Measure;
    dimension: Dimension;
    results: DataResponse;
    chartDataOverrides?: Partial<ChartData<'pie'>>;
    chartOptionsOverrides?: Partial<ChartOptions<'pie'>>;
}

const BasePieChart = ({
  measure,
  dimension,
  results,
  chartDataOverrides,
  chartOptionsOverrides,
}: BasePieChartProps ) => {

    const { data } = results;
  
    const chartRef = useRef<ChartJS<'pie', number[], string> | null>(null);

    

    const chartData = () => {
        return mergician({
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
                },
            ],
        }, 
        chartDataOverrides || {}) as ChartData<'pie'>;
    };

    const chartOptions = () => {
        return mergician({
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    position: 'bottom',
                    labels: {
                        font: {
                            family: getCSSValue('--font-sans') as string,
                            size: getCSSValue('--text-xs') as number
                        },
                        boxHeight: 8,
                        boxWidth: 8,
                        usePointStyle: true,
                    },
                },
                tooltip: {
                    backgroundColor: 'rgba(255, 255, 255, 0.95)',
                    titleColor: '#333',
                    bodyColor: '#333',
                    bodyFont: {
                        family: 'Inter, sans-serif',
                        size: 12,
                    },
                    titleFont: {
                        family: 'Inter, sans-serif',
                        size: 14,
                        weight: 'bold',
                    },
                    padding: 12,
                    borderColor: 'rgba(0, 0, 0, 0.1)',
                    borderWidth: 1,
                    displayColors: true,
                    boxWidth: 8,
                    boxHeight: 8,
                    boxPadding: 4,
                    usePointStyle: true,
                    callbacks: {
                        label: function(context:any) {
                            const label = context.label || '';
                            const value = context.raw as number;
                            const total = context.dataset.data.reduce((acc:number, val:number) => acc + (val as number), 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                }
            }
        }, chartOptionsOverrides || {}) as ChartOptions<'pie'>
    };


    console.log('chartData', chartData());

    return (
        <Pie 
            ref={chartRef}
            data={chartData()} 
            options={chartOptions()} 
            height="100%"
            width="100%"
        />
    );
};

export default BasePieChart;