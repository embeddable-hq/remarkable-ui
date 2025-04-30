// Third Party Libraries
import React, { useState, useRef, useCallback, useEffect } from 'react';
import type { Chart, ChartEvent, ActiveElement } from 'chart.js';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartData, ChartOptions, InteractionItem, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { Pie, getElementAtEvent } from 'react-chartjs-2';
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

type BasePieChartProps = {
    chartOptionsOverrides?: Partial<ChartOptions<'pie'>>;
    dimension: Dimension;
    measure: Measure;
    onSegmentClick?: (args: { dimensionValue: string | null; }) => void;
    results: DataResponse;
    showDataLabels?: 'auto' | true | false;
    showLegend?: boolean;
    showTooltips?: boolean;
}

const BasePieChart = ({
  chartOptionsOverrides,
  dimension,
  measure,
  onSegmentClick,
  results,
  showDataLabels,
  showLegend,
  showTooltips,
}: BasePieChartProps ) => {

    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    const { data } = results; 
    const chartRef = useRef<ChartJS<'pie', []>>(null);
    const theme = useTheme() as Theme; 

    const handlePieClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const { current: chart } = chartRef;
        if (!chart) {
            return;
        }
        const element: InteractionItem[] = getElementAtEvent(chart, event);
        if (!element.length || element[0].index === clickedIndex) {
            //clicked outside pie, or re-clicked segment
            onSegmentClick?.({
                dimensionValue: null
            })
            setClickedIndex(null);
            return;
        }
        const { index } = element[0];
        setClickedIndex(index);
        const dimensionValue = data?.[index][dimension.name]
        onSegmentClick?.({
            dimensionValue: dimensionValue
        })
    };

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
                    position: theme.charts.legendPosition || 'bottom',
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
            data={chartData()} 
            onClick={handlePieClick}
            options={chartOptions()} 
            ref={chartRef}
        />
    );
};

export default BasePieChart;