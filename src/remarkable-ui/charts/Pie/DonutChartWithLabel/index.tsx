import React from 'react';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { ChartOptions } from 'chart.js';
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart'
import { DonutChartWithLabelProps } from './DonutChartWithLabel.emb';

export default ({
    description,
    dimension,
    innerLabelMeasure,
    maxLegendItems,
    measure,
    results,
    resultsInnerLabel,
    showLegend,
    showTooltips,
    showValueLabels,
    title,  
}: DonutChartWithLabelProps) => {

    const chartOptionsOverrides= {
        cutout: '75%',
        plugins: {
            annotation: {
                annotations: {
                  dLabel: {
                    type: 'doughnutLabel',
                    content: () => [resultsInnerLabel?.data?.[0][innerLabelMeasure.name]],
                    font: [{size: 20}],
                    color: ['black']
                  }
                }
            } as any
        }
    }

    return (
        <Card
            data={results.data}            
            description={description}
            errorMessage={results.error}
            isLoading={results.isLoading || resultsInnerLabel.isLoading}
            title={title}
        >
            <BasePieChart 
                chartOptionsOverrides={chartOptionsOverrides}
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
