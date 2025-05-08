// Third Party Libraries
import { Chart as ChartJS, getElementAtEvent } from "react-chartjs-2";
import { InteractionItem, Chart } from 'chart.js';

// Local Libraries
import { Dimension, DataResponse } from "@embeddable.com/core";

export const handlePieClick = ( 
    event: React.MouseEvent<HTMLCanvasElement>,
    chart: Chart<"pie", [], unknown> | null,
    clickedIndex: number | null,
    onSegmentClick: ((args: { dimensionValue: string | null; }) => void) | undefined,
    setClickedIndex: (index: number | null) => void,  
    data: DataResponse["data"],
    dimension: Dimension, 
    mergedData: { [attr: string]: any }
) => {
    if (!chart) {
        return;
    }
    const element: InteractionItem[] = getElementAtEvent(chart, event);
    const { index } = element[0] ?? { index: null };

    //clicked outside pie, re-clicked segment, or clicked 'Other' category
    if (!element.length || index === clickedIndex || index === (mergedData.length - 1)) {
        console.log("clicked outside pie, re-clicked segment, or clicked 'Other' category");
        onSegmentClick?.({
            dimensionValue: null
        })
        setClickedIndex(null);
        return;
    }     
    //clicked a segment
    console.log("clicked a pie segment");
    setClickedIndex(index);
    const dimensionValue = data?.[index][dimension.name]
    onSegmentClick?.({
        dimensionValue: dimensionValue
    })
};