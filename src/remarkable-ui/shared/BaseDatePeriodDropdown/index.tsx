import React from 'react';
import Dropdown from '../BaseDropdown';
import { useDateRangeDropdown } from './useDateRangeDropdown';
import { EnabledRange } from '../../utils/relativeDateRanges';
import { TimeRange } from '@embeddable.com/core';

type BaseDatePeriodDropdownProps = {
	children: React.ReactElement<{ isOpen?: boolean }>;
	handleClick: (range?: EnabledRange) => void;
	preSelectedValue: TimeRange;
};

export default function BaseDatePeriodDropdown(props: BaseDatePeriodDropdownProps) {
	const { items } = useDateRangeDropdown({
		preSelectedValue: props.preSelectedValue,
		onSelect: props.handleClick,
	});

	return (
		<Dropdown items={items} align="left" closeDropdownOnItemClick={true}>
			{props.children}
		</Dropdown>
	);
}
