// Third Party Libraries
import { mergician } from 'mergician';
import { format as dateFnsFormat } from 'date-fns';
import { Granularity } from '@embeddable.com/core';
import { FormatHelper } from '../hooks/useFormatter';

// Get start/end of quarter, offset=0 for this quarter, -1 for last, +1 for next, etc.
function getQuarterBounds(date: Date, offset = 0): { from: Date, to: Date, granularity: Granularity } {
	const currentQuarter = Math.floor(date.getMonth() / 3);
	const targetQuarter = currentQuarter + offset;
	const yearShift = Math.floor(targetQuarter / 4);
	const quarterIndex = ((targetQuarter % 4) + 4) % 4;
	const year = date.getFullYear() + yearShift;
	const start = new Date(year, quarterIndex * 3, 1);
	const end = new Date(year, quarterIndex * 3 + 3, 0, 23, 59, 59, 999);
	return { from: start, to: end, granularity: 'quarter' };
}

// Get start/end of week (ISO Monday–Sunday), offset=0 this week, -1 last, +1 next
function getWeekBounds(date: Date, offset = 0): { from: Date; to: Date, granularity: Granularity } {
	const d = new Date(date);
	const day = (d.getDay() + 6) % 7; // Mon=0…Sun=6
	d.setDate(d.getDate() - day + offset * 7);
	const from = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	const to = new Date(from);
	to.setDate(from.getDate() + 6);
	to.setHours(23, 59, 59, 999);
	return { from, to, granularity: 'day' };
}

export type RangeConfig = {
	label: string;
	calculate?: () => { from: Date; to: Date, granularity: Granularity };
	enabled?: boolean;
};

export type ranges = {
	[key: string]: RangeConfig;
};

const defaultRanges: { [key: string]: RangeConfig } = {
	today: {
		label: 'Today',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const to = new Date(from);
			to.setHours(23, 59, 59, 999);
			return { from, to, granularity: 'day' };
		},
	},

	yesterday: {
		label: 'Yesterday',
		calculate: () => {
			const now = new Date();
			const from = new Date(now);
			from.setDate(now.getDate() - 1);
			from.setHours(0, 0, 0, 0);
			const to = new Date(from);
			to.setHours(23, 59, 59, 999);
			return { from, to, granularity: 'day' }
		},
	},

	thisWeek: {
		label: 'This week',
		calculate: () => getWeekBounds(new Date(), 0),
	},

	lastWeek: {
		label: 'Last week',
		calculate: () => getWeekBounds(new Date(), -1),
	},

	weekToDate: {
		label: 'Week to date',
		calculate: () => {
			const now = new Date();
			const { from } = getWeekBounds(now, 0);
			const to = now;
			return { from, to, granularity: 'day' };
		},
	},

	last7Days: {
		label: 'Last 7 days',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today
			const from = new Date(to);
			from.setDate(to.getDate() - 6); // include today + 6 previous days = 7 calendar days
			from.setHours(0, 0, 0, 0); // start of that day
			return { from, to, granularity: 'day' };
		},
	},

	next7Days: {
		label: 'Next 7 days',
		calculate: () => {
			const from = new Date();
			from.setHours(0, 0, 0, 0); // start of today
			const to = new Date(from);
			to.setDate(from.getDate() + 6); // today + 6 more days = 7 calendar days
			to.setHours(23, 59, 59, 999); // end of that last day
			return { from, to, granularity: 'day' };
		},
	},

	last30Days: {
		label: 'Last 30 days',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today

			const from = new Date(to);
			from.setDate(to.getDate() - 29); // include today + 29 previous days = 30 days
			from.setHours(0, 0, 0, 0); // start of that day

			return { from, to, granularity: 'day' };
		},
	},

	next30Days: {
		label: 'Next 30 days',
		calculate: () => {
			const from = new Date();
			from.setHours(0, 0, 0, 0); // start of today

			const to = new Date(from);
			to.setDate(from.getDate() + 29); // today + 29 more days = 30 days
			to.setHours(23, 59, 59, 999); // end of that last day

			return { from, to, granularity: 'day' };
		},
	},

	thisMonth: {
		label: 'This month',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth(), 1);
			const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
			return { from, to, granularity: 'month' };
		},
	},

	lastMonth: {
		label: 'Last month',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
			return { from, to, granularity: 'month' };
		},
	},

	nextMonth: {
		label: 'Next month',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth() + 1, 1);
			const to = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
			return { from, to, granularity: 'month' };
		},
	},

	thisQuarter: {
		label: 'This quarter',
		calculate: () => getQuarterBounds(new Date(), 0),
	},

	lastQuarter: {
		label: 'Last quarter',
		calculate: () => getQuarterBounds(new Date(), -1),
	},

	nextQuarter: {
		label: 'Next quarter',
		calculate: () => getQuarterBounds(new Date(), +1),
	},

	quarterToDate: {
		label: 'Quarter to date',
		calculate: () => {
			const now = new Date();
			const { from } = getQuarterBounds(now, 0);
			const to = now;
			return { from, to, granularity: 'day' };
		},
	},

	last6Months: {
		label: 'Last 6 months',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today

			const from = new Date(to);
			from.setMonth(to.getMonth() - 6); // 6 months ago, same day
			from.setHours(0, 0, 0, 0); // start of that day

			return { from, to, granularity: 'day' };
		},
	},

	last12Months: {
		label: 'Last 12 months',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today

			const from = new Date(to);
			from.setMonth(to.getMonth() - 12); // 12 months ago, same day
			from.setHours(0, 0, 0, 0); // start of that day

			return { from, to, granularity: 'day' };
		},
	},

	thisYear: {
		label: 'This year',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), 0, 1);
			const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
			return { from, to, granularity: 'year' };
		},
	},

	lastYear: {
		label: 'Last year',
		calculate: () => {
			const now = new Date();
			const year = now.getFullYear() - 1;
			const from = new Date(year, 0, 1);
			const to = new Date(year, 11, 31, 23, 59, 59, 999);
			return { from, to, granularity: 'year' };
		},
	},

	nextYear: {
		label: 'Next year',
		calculate: () => {
			const now = new Date();
			const year = now.getFullYear() + 1;
			const from = new Date(year, 0, 1);
			const to = new Date(year, 11, 31, 23, 59, 59, 999);
			return { from, to, granularity: 'year' };
		},
	},

	yearToDate: {
		label: 'Year to date',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), 0, 1);
			const to = now;
			return { from, to, granularity: 'day' };
		},
	},

	allTime: {
		label: 'All time',
	},
};

export type EnabledRange = {
	label: string;
	from: Date | undefined;
	to: Date | undefined;
	formattedRange: string;
};

const formattedRange = (from: Date | undefined, to: Date | undefined, granularity: Granularity, formatter: FormatHelper) => {
	if (!from || !to) {
		return '';
	}
	const formattedFrom = formatter.dateTime(from, { granularity, shortYear: true });
	const formattedTo = formatter.dateTime(to, { granularity, shortYear: true });
	if (formattedFrom === formattedTo) {
		return formatter.dateTime(from, { granularity, shortYear: false });
	}
	return `${formattedFrom} - ${formattedTo}`;
};

export const relativeDateRanges = (dateRangesFromTheme = {} as ranges, formatter: FormatHelper): EnabledRange[] => {
	//Merge the default ranges with any passed in via the theme
	const ranges = mergician(defaultRanges, dateRangesFromTheme) as ranges;
	//Return an array of enabled ranges
	return Object.keys(ranges)
		.map((range) => {
			const item = ranges[range];
			if (item.enabled === false) {
				return null;
			}
			const { from, to, granularity } = item.calculate?.() || { from: undefined, to: undefined, granularity: 'day' };
			return {
				label: item.label,
				from: from,
				to: to,
				formattedRange: formattedRange(from, to, granularity, formatter),
			};
		})
		.filter((range) => range !== null);
};
