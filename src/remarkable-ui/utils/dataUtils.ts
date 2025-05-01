import { DataResponse, Dimension, Measure } from '@embeddable.com/core';


// Merge long tail data when a user specifies a maximum number of legend items.
export const aggregateLongTail = (
    data: DataResponse["data"] = [],
    dimension: Dimension,
    measure: Measure,
    threshold?: number,
) => {

    if (!threshold || data.length <= threshold) return data;
    
    const head = data.slice(0, threshold - 1);
    const tail = data.slice(threshold - 1);
    const sumTail = tail.reduce(
        (sum, row) => sum + (parseFloat(row[measure.name])),
        0
    );
    
    return [
        ...head,
        {
          [dimension.name]: 'Other',
          [measure.name]: sumTail,
        },
    ];
    
}