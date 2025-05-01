// Local Libraries
import { getStyle } from "../utils/cssUtils"


export const tooltipStyle = {
    backgroundColor: getStyle('--chart-tooltip-background'),
    bodyAlign: getStyle('--chart-tooltip-category-align'),
    bodyColor: getStyle('--chart-tooltip-category-color'),
    bodyFont: {
        family: getStyle('--chart-tooltip-category-family'),
        size: getStyle('--chart-tooltip-category-size'),
        weight: getStyle('--chart-tooltip-category-weight'),
    },
    boxPadding: getStyle('--chart-tooltip-gap'),
    cornerRadius: getStyle('--chart-tooltip-radius'),
    displayColors: true,
    padding: getStyle('--chart-tooltip-padding'),
    titleAlign: getStyle('--chart-tooltip-title-align'),
    titleColor: getStyle('--chart-tooltip-title-color'),
    titleFont: {
        family: getStyle('--chart-tooltip-title-family'),
        size: getStyle('--chart-tooltip-title-size'),
        weight: getStyle('--chart-tooltip-title-weight'),
    },
    usePointStyle: true,
}

export const datalabelStyle = {
    backgroundColor: getStyle('--chart-label-background'), // white background for the label
    borderRadius: getStyle('--chart-label-radius'), // round the corners
    padding: {
        top: getStyle('--chart-label-padding-top'),
        right: getStyle('--chart-label-padding-right'),
        bottom:  getStyle('--chart-label-padding-bottom'),
        left: getStyle('--chart-label-padding-left'),
    },
    color: getStyle('--chart-label-color'),
    font: {
        family: getStyle('--chart-label-family'),
        size: getStyle('--chart-label-size'),
        weight: getStyle('--chary-label-weight'), 
    }
}

export const legendStyle = {
    boxHeight: getStyle('--cat-indicator-width'),
    boxWidth: getStyle('--cat-indicator-height'),
    usePointStyle: true,
    color: getStyle('--cat-name-color'),
    font: {
        family: getStyle('--cat-name-family'),
        size: getStyle('--cat-name-size'),
        weight: getStyle('--cat-name-weight'),        
    }
}
