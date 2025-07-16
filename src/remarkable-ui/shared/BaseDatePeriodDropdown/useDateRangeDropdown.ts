import { useEffect, useRef, useMemo } from 'react';
import { useTheme } from '@embeddable.com/react';
import { relativeDateRanges, EnabledRange } from '../../utils/relativeDateRanges';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { TimeRange } from '@embeddable.com/core';
import useFormatter from '../../hooks/useFormatter';

type Params = {
	preSelectedValue: TimeRange;
	handleClick: (range?: EnabledRange) => void;
};

export function useDateRangeDropdown({ preSelectedValue, handleClick }: Params) {
	// 1) pull and compute the ranges
	const theme = useTheme() as Theme;
	const formatter = useFormatter();
	const ranges = useMemo(
		() => relativeDateRanges(theme.customRelativeDateRanges, formatter),
		[theme.customRelativeDateRanges, formatter.language()],
	);

	// If the associated time range variable is given a default value within Embeddable's builder, check if it's one of the enabled ranges. If it is, calculate the range and pass it to Embeddable. If it's not, it should not be used so clear it.
	const hasRun = useRef(false);
	useEffect(() => {
		if (hasRun.current) return;
		if (preSelectedValue?.relativeTimeString) {
			hasRun.current = true;
			const match = ranges.find((r) => r.label === preSelectedValue.relativeTimeString);
			handleClick(match);
		}
		// we only ever want to run this once, so we intentionally omit `ranges` from the deps
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [preSelectedValue]);

	return { ranges };
}
