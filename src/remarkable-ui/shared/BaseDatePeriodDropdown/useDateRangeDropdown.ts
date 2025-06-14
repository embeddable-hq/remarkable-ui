import { useEffect, useRef, useMemo } from 'react';
import { useTheme } from '@embeddable.com/react';
import { relativeDateRanges, EnabledRange } from '../../utils/relativeDateRanges';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { DropdownItem } from '../BaseDropdown';
import { TimeRange } from '@embeddable.com/core';
import DefaultDropdownItem from '../BaseDropdown/DefaultDropdownItem';

type Params = {
	preSelectedValue: TimeRange;
	handleClick: (range?: EnabledRange) => void;
};

export function useDateRangeDropdown({ preSelectedValue, handleClick }: Params) {
	// 1) pull and compute the ranges
	const theme = useTheme() as Theme;
	const ranges = useMemo(
		() => relativeDateRanges(theme.customRelativeDateRanges),
		[theme.customRelativeDateRanges],
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
