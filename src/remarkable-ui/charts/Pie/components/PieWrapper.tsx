import React from 'react';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import Card from '../../../shared/Card';
import BasePieChart from '../../../shared/BasePieChart'

type PieWrapperProps = {
    cutout?: number;
    description?: string;
    dimension: Dimension;
    maxLegendItems?: number;
    measure: Measure;
    results: DataResponse;
    showLegend?: boolean;
    showTooltips?: boolean;
    showValueLabels?: boolean;
    title?: string;
  }

export function PieWrapper ({
    cutout,
    description,
    dimension,
    maxLegendItems,
    measure,
    results,
    showLegend,
    showTooltips,
    showValueLabels,
    title,  
}: PieWrapperProps) {

    const { isLoading, error, data } = results;

    const chartOptionsOverrides = {
        cutout: cutout === undefined ? '0%' : `${cutout}%`,
        plugins: {
            datalabels: {
                display: showValueLabels ? 'auto' : false
            },
            legend: {
              display: showLegend
            },
            tooltip: {
                enabled: showTooltips
            },
        }
    };

    return (
        <Card
            errorMessage={error}
            isLoading={isLoading}
            title={title}
            description={description}
            data={data}            
        >
            <BasePieChart 
                measure={measure}
                dimension={dimension}
                results={results}
                chartOptionsOverrides={chartOptionsOverrides}
            />        
        </Card>
    );
};