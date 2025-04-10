import React from 'react';
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart'
import { DonutChartWithLabelProps } from './DonutChartWithLabel.emb';
import { getCSSValue } from '../../../utils/cssUtils';
import { formatValue } from '../../../utils/formatUtils';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../../themes/remarkableTheme/theme'

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

    const theme = useTheme() as Theme;

    const innerLabelValue = resultsInnerLabel?.data?.[0][innerLabelMeasure.name] || "";

    const chartOptionsOverrides= {
        cutout: '60%',
        plugins: {
            annotation: {
                annotations: {
                  dLabel: {
                    type: 'doughnutLabel',
                    content: () => [
                        formatValue(innerLabelValue, { typeHint: 'number', theme: theme }), 
                        formatValue('Some Label', { typeHint: 'string', theme: theme })
                    ], // one element per line
                    font: [{
                        family: getCSSValue('--donut-number-family'),
                        size: getCSSValue('--donut-number-size'), 
                        weight: getCSSValue('--donut-number-weight'),
                    }, {
                        family: getCSSValue('--donut-label-family'),
                        size: getCSSValue('--donut-label-size'), 
                        weight: getCSSValue('--donut-label-weight'),
                    }],
                    color: [
                        getCSSValue('--donut-number-color'), 
                        getCSSValue('--donut-label-color')
                    ]
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
