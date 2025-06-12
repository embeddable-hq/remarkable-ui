// Third Party Libraries
import React, { useState, useEffect, useRef } from 'react';

// Embeddable Libraries
import { useTheme } from '@embeddable.com/react';
import { TimeRange } from '@embeddable.com/core';

// Local Libraries
import { relativeDateRanges, enabledRange } from '../../utils/relativeDateRanges';
import { Theme } from '../../../themes/remarkableTheme/theme';
import Dropdown, { DropdownItem } from '../BaseDropdown';

type BaseDatePeriodDropdownProps = {
	children: React.ReactElement<{ isOpen?: boolean }>;
	handleClick: (range?: enabledRange) => void;
	preSelectedValue: TimeRange;
};

export default function BaseDatePeriodDropdown({
	children,
	handleClick,
	preSelectedValue,
}: BaseDatePeriodDropdownProps) {
	// If the associated time range variable is given a default value within Embeddable's builder, check if it's one of the enabled ranges.
	// If it is, calculate the range and pass it to Embeddable. If it's not, it should not be used so clear it.
	const hasRun = useRef(false);
	useEffect(() => {
		if (hasRun.current) return; // already run—do nothing
		if (preSelectedValue) {
			hasRun.current = true;
			if (preSelectedValue.relativeTimeString) {
				handleClick(ranges.find((range) => range.label === preSelectedValue.relativeTimeString));
			} else {
				handleClick();
			}
		}
	}, [preSelectedValue]);

	// Get the list of enabled ranges from the theme
	const theme = useTheme() as Theme;
	const ranges = relativeDateRanges(theme.customRelativeDateRanges);

	// Create the dropdown items from the enabled ranges
	const dropdownItems = ranges.map((range, i) => {
		return {
			id: `${range.label}-${i}`,
			label: `${range.label} ${range.formattedRange}`,
			onClick: () => {
				handleClick(range);
			},
		};
	}) as DropdownItem[];

	return (
		<Dropdown items={dropdownItems} align="left" closeDropdownOnItemClick={true}>
			{children}
		</Dropdown>
	);
}
