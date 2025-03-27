
import React from 'react';
import { PieChartProps } from './PieChart.emb'
import Card from '../../shared/Card';
import BasePieChart from '../base/BasePieChart';

export const PieChart = ({
  measure,
  dimension,
  results,
  title,
  description
}: PieChartProps) => {

    const { isLoading, error, data } = results;

    return (
        <Card
            errorMessage={error}
            isLoading={isLoading}
            title={title}
            data={data}
            description={description}
        >
            <BasePieChart 
                measure={measure}
                dimension={dimension}
                results={results}
            />        
        </Card>
    );
};

export default PieChart;
