//this is where the default remarkable theme will live
//may want to break out css base variables, so they're not included in the theme.
//And import them somewhere else.

import { defaultI18nTheme } from './18n';
import { cssVariables } from './cssVariables';
import { Theme } from './theme';

const CHART_BORDERS = [
	'#5F6CAF',
	'#EF8A88',
	'#8FBED8',
	'#F4B992',
	'#75B9B0',
	'#B5AEE0',
	'#D28CA5',
	'#D4A373',
	'#A9C5A0',
	'#8CA587',
];

const CHART_COLORS = [
	'#5F6CAF',
	'#EF8A88',
	'#8FBED8',
	'#F4B992',
	'#75B9B0',
	'#B5AEE0',
	'#D28CA5',
	'#D4A373',
	'#A9C5A0',
	'#8CA587',
];

export const remarkableTheme: Theme = {
	styles: cssVariables,
	charts: {
		borderColors: CHART_BORDERS,
		colors: CHART_COLORS,
	},
	i18n: defaultI18nTheme
};

export default remarkableTheme;
