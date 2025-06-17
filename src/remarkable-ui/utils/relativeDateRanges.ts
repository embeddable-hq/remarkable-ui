// Third Party Libraries
import { mergician } from 'mergician';
import { format as dateFnsFormat } from 'date-fns';

// Get start/end of quarter, offset=0 for this quarter, -1 for last, +1 for next, etc.
function getQuarterBounds(date: Date, offset = 0) {
	const currentQuarter = Math.floor(date.getMonth() / 3);
	const targetQuarter = currentQuarter + offset;
	const yearShift = Math.floor(targetQuarter / 4);
	const quarterIndex = ((targetQuarter % 4) + 4) % 4;
	const year = date.getFullYear() + yearShift;
	const start = new Date(year, quarterIndex * 3, 1);
	const end = new Date(year, quarterIndex * 3 + 3, 0, 23, 59, 59, 999);
	return { from: start, to: end };
}

// Get start/end of week (ISO Monday–Sunday), offset=0 this week, -1 last, +1 next
function getWeekBounds(date: Date, offset = 0) {
	const d = new Date(date);
	const day = (d.getDay() + 6) % 7; // Mon=0…Sun=6
	d.setDate(d.getDate() - day + offset * 7);
	const from = new Date(d.getFullYear(), d.getMonth(), d.getDate());
	const to = new Date(from);
	to.setDate(from.getDate() + 6);
	to.setHours(23, 59, 59, 999);
	return { from, to };
}

export type RangeConfig = {
	label: string;
	calculate?: () => { from: Date; to: Date };
	dateFormat?: string;
	enabled?: boolean;
};

export type ranges = {
	[key: string]: RangeConfig;
};

const defaultRanges = {
	today: {
		label: 'Today',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
			const to = new Date(from);
			to.setHours(23, 59, 59, 999);
			return { from, to };
		},
		dateFormat: 'MMM dd',
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
			return { from, to };
		},
		dateFormat: 'MMM dd',
	},

	thisWeek: {
		label: 'This week',
		calculate: () => getWeekBounds(new Date(), 0),
		dateFormat: 'MMM dd',
	},

	lastWeek: {
		label: 'Last week',
		calculate: () => getWeekBounds(new Date(), -1),
		dateFormat: 'MMM dd',
	},

	weekToDate: {
		label: 'Week to date',
		calculate: () => {
			const now = new Date();
			const { from } = getWeekBounds(now, 0);
			const to = now;
			return { from, to };
		},
		dateFormat: 'MMM dd',
	},

	last7Days: {
		label: 'Last 7 days',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today
			const from = new Date(to);
			from.setDate(to.getDate() - 6); // include today + 6 previous days = 7 calendar days
			from.setHours(0, 0, 0, 0); // start of that day
			return { from, to };
		},
		dateFormat: 'MMM dd',
	},

	next7Days: {
		label: 'Next 7 days',
		calculate: () => {
			const from = new Date();
			from.setHours(0, 0, 0, 0); // start of today
			const to = new Date(from);
			to.setDate(from.getDate() + 6); // today + 6 more days = 7 calendar days
			to.setHours(23, 59, 59, 999); // end of that last day
			return { from, to };
		},
		dateFormat: 'MMM dd',
	},

	last30Days: {
		label: 'Last 30 days',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today

			const from = new Date(to);
			from.setDate(to.getDate() - 29); // include today + 29 previous days = 30 days
			from.setHours(0, 0, 0, 0); // start of that day

			return { from, to };
		},
		dateFormat: 'MMM dd',
	},

	next30Days: {
		label: 'Next 30 days',
		calculate: () => {
			const from = new Date();
			from.setHours(0, 0, 0, 0); // start of today

			const to = new Date(from);
			to.setDate(from.getDate() + 29); // today + 29 more days = 30 days
			to.setHours(23, 59, 59, 999); // end of that last day

			return { from, to };
		},
		dateFormat: 'MMM dd',
	},

	thisMonth: {
		label: 'This month',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth(), 1);
			const to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
			return { from, to };
		},
		dateFormat: 'MMM yy',
	},

	lastMonth: {
		label: 'Last month',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
			const to = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);
			return { from, to };
		},
		dateFormat: 'MMM yy',
	},

	nextMonth: {
		label: 'Next month',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), now.getMonth() + 1, 1);
			const to = new Date(now.getFullYear(), now.getMonth() + 2, 0, 23, 59, 59, 999);
			return { from, to };
		},
		dateFormat: 'MMM yy',
	},

	thisQuarter: {
		label: 'This quarter',
		calculate: () => getQuarterBounds(new Date(), 0),
		dateFormat: 'MMM yy',
	},

	lastQuarter: {
		label: 'Last quarter',
		calculate: () => getQuarterBounds(new Date(), -1),
		dateFormat: 'MMM yy',
	},

	nextQuarter: {
		label: 'Next quarter',
		calculate: () => getQuarterBounds(new Date(), +1),
		dateFormat: 'MMM yy',
	},

	quarterToDate: {
		label: 'Quarter to date',
		calculate: () => {
			const now = new Date();
			const { from } = getQuarterBounds(now, 0);
			const to = now;
			return { from, to };
		},
		dateFormat: 'MMM yy',
	},

	last6Months: {
		label: 'Last 6 months',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today

			const from = new Date(to);
			from.setMonth(to.getMonth() - 6); // 6 months ago, same day
			from.setHours(0, 0, 0, 0); // start of that day

			return { from, to };
		},
		dateFormat: 'MMM yy',
	},

	last12Months: {
		label: 'Last 12 months',
		calculate: () => {
			const to = new Date();
			to.setHours(23, 59, 59, 999); // end of today

			const from = new Date(to);
			from.setMonth(to.getMonth() - 12); // 12 months ago, same day
			from.setHours(0, 0, 0, 0); // start of that day

			return { from, to };
		},
		dateFormat: 'MMM yy',
	},

	thisYear: {
		label: 'This year',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), 0, 1);
			const to = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
			return { from, to };
		},
		dateFormat: 'yyyy',
	},

	lastYear: {
		label: 'Last year',
		calculate: () => {
			const now = new Date();
			const year = now.getFullYear() - 1;
			const from = new Date(year, 0, 1);
			const to = new Date(year, 11, 31, 23, 59, 59, 999);
			return { from, to };
		},
		dateFormat: 'yyyy',
	},

	nextYear: {
		label: 'Next year',
		calculate: () => {
			const now = new Date();
			const year = now.getFullYear() + 1;
			const from = new Date(year, 0, 1);
			const to = new Date(year, 11, 31, 23, 59, 59, 999);
			return { from, to };
		},
		dateFormat: 'yyyy',
	},

	yearToDate: {
		label: 'Year to date',
		calculate: () => {
			const now = new Date();
			const from = new Date(now.getFullYear(), 0, 1);
			const to = now;
			return { from, to };
		},
		dateFormat: 'MMM yy',
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

const formattedRange = (from: Date | undefined, to: Date | undefined, dateFormat?: string) => {
	if (!from || !to || !dateFormat) {
		return '';
	}
	const formattedFrom = dateFnsFormat(from, dateFormat);
	const formattedTo = dateFnsFormat(to, dateFormat);
	if (formattedFrom === formattedTo) {
		return formattedFrom;
	}
	return `${formattedFrom} - ${formattedTo}`;
};

export const relativeDateRanges = (dateRangesFromTheme = {} as ranges): EnabledRange[] => {
	//Merge the default ranges with any passed in via the theme
	const ranges = mergician(defaultRanges, dateRangesFromTheme) as ranges;
	//Return an array of enabled ranges
	return Object.keys(ranges)
		.map((range) => {
			const item = ranges[range];
			if (item.enabled === false) {
				return null;
			}
			const { from, to } = item.calculate?.() || { from: undefined, to: undefined };
			return {
				label: item.label,
				from: from,
				to: to,
				formattedRange: formattedRange(from, to, item.dateFormat),
			};
		})
		.filter((range) => range !== null);
};
