import { getCSSValue } from "../utils/cssUtils"


export const tooltipStyle = {
    backgroundColor: getCSSValue('--foreground-default') as string,
    titleColor: '#fff',
    bodyColor: '#fff',
    padding: 12,
    cornerRadius: 12,
    displayColors: true,
    boxPadding: 4,
    usePointStyle: true,
}

export const datalabelStyle = {
    backgroundColor: '#fff', // white background for the label
    borderRadius: 100, // round the corners
    padding: {
        top: 2,
        right:4,
        bottom:2,
        left:4
    },
}

export const legendStyle = {
    boxHeight: 8,
    boxWidth: 8,
    usePointStyle: true,
}