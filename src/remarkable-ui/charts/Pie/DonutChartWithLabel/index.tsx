import React from 'react';
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart'
import { DonutChartWithLabelProps } from './DonutChartWithLabel.emb';
import { getCSSValue } from '../../../utils/cssUtils';

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

    const innerLabelValue = resultsInnerLabel?.data?.[0][innerLabelMeasure.name] || "";

    const chartOptionsOverrides= {
        cutout: '60%',
        plugins: {
            annotation: {
                annotations: {
                  dLabel: {
                    type: 'doughnutLabel',
                    content: () => [innerLabelValue], // one element per line
                    font: [{size: 30, weight: getCSSValue('--font-bold')}],
                    color: [getCSSValue('--foreground-default')]
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
