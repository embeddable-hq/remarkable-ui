// Third Party Libraries
import React, { useState, useRef } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, ChartOptions, LinearScale } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import AnnotationPlugin from 'chartjs-plugin-annotation';
import { Pie } from 'react-chartjs-2';
import { mergician } from 'mergician';

// Embeddable Libraries
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { useTheme } from '@embeddable.com/react';

// Local Libraries
import { tooltipStyle, datalabelStyle, legendStyle } from '../../constants/commonChartStyles';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { formatValue } from '../../utils/formatUtils';
import { aggregateLongTail } from '../../utils/dataUtils';
import { getColor } from '../../utils/colorUtils';
import { handlePieClick } from './handlers';

// Register ChartJS components
ChartJS.register(ArcElement, LinearScale, Tooltip, Legend, ChartDataLabels, AnnotationPlugin);

type BasePieChartProps = {
    chartOptionsOverrides?: Partial<ChartOptions<'pie'>>;
    dimension: Dimension;
    maxLegendItems?: number;
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
  maxLegendItems
}: BasePieChartProps ) => {

    const [clickedIndex, setClickedIndex] = useState<number | null>(null);

    const chartRef = useRef<ChartJS<'pie', []>>(null);
    
    const { data } = results;  
    const mergedData = aggregateLongTail(data, dimension, measure, maxLegendItems) || [];

    const theme = useTheme() as Theme; 
    const themeColors = mergedData.map((item, i) => getColor(item[dimension.name], theme.charts.colors, i))
    const themeBorderColors = mergedData.map((item, i) => getColor(item[dimension.name], theme.charts.borderColors, i));

    const chartData = () => {
        return {
            labels: mergedData.map((item) => formatValue(item[dimension.name], { typeHint: 'string', theme: theme })),
            datasets: [
                {
                    data: mergedData.map((item) => item[measure.name]),
                    backgroundColor: themeColors,
                    borderColor: themeBorderColors,
                    borderWidth: 0,
                    hoverBackgroundColor: themeBorderColors,
                    hoverBorderWidth: 0,
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
                    display: showDataLabels ? 'auto' : false,
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
            onClick={(event) => handlePieClick(
                event,
                chartRef.current,
                clickedIndex,
                onSegmentClick,
                setClickedIndex,
                data,
                dimension,
                mergedData
            )}
            options={chartOptions()} 
            ref={chartRef}
        />
    );
};

export default BasePieChart;