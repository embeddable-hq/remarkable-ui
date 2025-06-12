// Local Libraries
import { getStyle } from '../utils/cssUtils';

export const getTooltipStyle = () => ({
	backgroundColor: getStyle('--em-chart-tooltip-background'),
	bodyAlign: getStyle('--em-chart-tooltip-category-align'),
	bodyColor: getStyle('--em-chart-tooltip-category-color'),
	bodyFont: {
		family: getStyle('--em-chart-tooltip-category-family'),
		size: getStyle('--em-chart-tooltip-category-size'),
		weight: getStyle('--em-chart-tooltip-category-weight'),
	},
	boxPadding: getStyle('--em-chart-tooltip-gap'),
	cornerRadius: getStyle('--em-chart-tooltip-radius'),
	displayColors: true,
	padding: getStyle('--em-chart-tooltip-padding'),
	titleAlign: getStyle('--em-chart-tooltip-title-align'),
	titleColor: getStyle('--em-chart-tooltip-title-color'),
	titleFont: {
		family: getStyle('--em-chart-tooltip-title-family'),
		size: getStyle('--em-chart-tooltip-title-size'),
		weight: getStyle('--em-chart-tooltip-title-weight'),
	},
	usePointStyle: true,
});

export const getDatalabelStyle = () => ({
	backgroundColor: getStyle('--em-chart-label-background'), // white background for the label
	borderRadius: getStyle('--em-chart-label-radius'), // round the corners
	padding: {
		top: getStyle('--em-chart-label-padding-top'),
		right: getStyle('--em-chart-label-padding-right'),
		bottom: getStyle('--em-chart-label-padding-bottom'),
		left: getStyle('--em-chart-label-padding-left'),
	},
	color: getStyle('--em-chart-label-color'),
	font: {
		family: getStyle('--em-chart-label-family'),
		size: getStyle('--em-chart-label-size'),
		weight: getStyle('--em-chary-label-weight'),
	},
});

export const getLegendStyle = () => ({
	boxHeight: getStyle('--em-cat-indicator-width'),
	boxWidth: getStyle('--em-cat-indicator-height'),
	usePointStyle: true,
	color: getStyle('--em-cat-name-color'),
	font: {
		family: getStyle('--em-cat-name-family'),
		size: getStyle('--em-cat-name-size'),
		weight: getStyle('--em-cat-name-weight'),
	},
});
