import { getCSSValue } from "../utils/cssUtils"


export const tooltipStyle = {
    backgroundColor: getCSSValue('--chart-tooltip-background'),
    titleColor: getCSSValue('--chart-tooltip-title-color'),
    bodyColor: getCSSValue('--chart-tooltip-category-color'),
    padding: getCSSValue('--chart-tooltip-padding'),
    cornerRadius: getCSSValue('--chart-tooltip-radius'),
    displayColors: true,
    usePointStyle: true,
    titleFont: {
        family: getCSSValue('--chart-tooltip-title-family'),
        size: getCSSValue('--chart-tooltip-title-size'),
        weight: getCSSValue('--chart-tooltip-title-weight'),
    },
    bodyFont: {
        family: getCSSValue('--chart-tooltip-category-family'),
        size: getCSSValue('--chart-tooltip-category-size'),
        weight: getCSSValue('--chart-tooltip-category-weight'),
    },
}

export const datalabelStyle = {
    backgroundColor: getCSSValue('--chart-label-background'), // white background for the label
    borderRadius: getCSSValue('--chart-label-radius'), // round the corners
    padding: {
        top: getCSSValue('--chart-label-padding-top'),
        right: getCSSValue('--chart-label-padding-right'),
        bottom:  getCSSValue('--chart-label-padding-bottom'),
        left: getCSSValue('--chart-label-padding-left'),
    },
    color: getCSSValue('--chart-label-color'),
    font: {
        family: getCSSValue('--chart-label-family'),
        size: getCSSValue('--chart-label-size'),
        weight: getCSSValue('--chary-label-weight'), 
    }
}

export const legendStyle = {
    boxHeight: getCSSValue('--cat-indicator-width'),
    boxWidth: getCSSValue('--cat-indicator-height'),
    usePointStyle: true,
    color: getCSSValue('--cat-name-color'),
    font: {
        family: getCSSValue('--cat-name-family'),
        size: getCSSValue('--cat-name-size'),
        weight: getCSSValue('--cat-name-weight'),        
    }
}
