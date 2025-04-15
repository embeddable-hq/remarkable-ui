// React & Third Party Libraries
import React from 'react';

// Local Libraries
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart';
import { PieChartProps } from './PieChart.emb';

export default ({
    description,
    dimension,
    maxLegendItems,
    measure,
    results,
    showLegend,
    showTooltips,
    showValueLabels,
    title,  
}: PieChartProps) => {

    return (
        <Card
            data={results.data}            
            description={description}
            errorMessage={results.error}
            isLoading={results.isLoading}
            title={title}
        >
            <BasePieChart
                dimension={dimension}
                measure={measure}
                results={results}
                showDataLabels={showValueLabels ? 'auto' : false}
                showLegend={showLegend}
                showTooltips={showTooltips}
            />        
        </Card>
    );
};
