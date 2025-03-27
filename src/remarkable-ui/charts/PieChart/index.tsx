
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


    const chartOptionsOverrides = {
        cutout: '50%',
        plugins: {
            legend: {
              display: true
            }
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

export default PieChart;
