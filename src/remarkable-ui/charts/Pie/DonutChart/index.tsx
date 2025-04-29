// Third Party Libraries
import React from 'react';
import { ChartOptions } from 'chart.js';

// Embeddable Libraries
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';

// Local Libraries
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart';
import { DonutChartProps } from './DonutChart.emb';

export default ({
    description,
    dimension,
    maxLegendItems,
    measure,
    onSegmentClick,
    results,
    showLegend,
    showTooltips,
    showValueLabels,
    title,
}: DonutChartProps) => {

    const chartOptionsOverrides= {
        cutout: '60%',
    }

    return (
        <Card
            data={results.data}            
            description={description}
            errorMessage={results.error}
            isLoading={results.isLoading}
            title={title}
        >
            <BasePieChart 
                chartOptionsOverrides={chartOptionsOverrides}
                dimension={dimension}
                measure={measure}
                onSegmentClick={onSegmentClick}
                results={results}
                showDataLabels={showValueLabels ? 'auto' : false}
                showLegend={showLegend}
                showTooltips={showTooltips}
            />        
        </Card>
    );
};
