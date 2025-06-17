// Third Party Libraries
import React, { useMemo } from 'react';

// Embeddable Libraries
import { TimeRange } from '@embeddable.com/core';

// Local Libraries
import { DropdownItem } from '../BaseDropdown';
import { EnabledRange } from '../../utils/relativeDateRanges';
import { useDateRangeDropdown } from './useDateRangeDropdown';
import DefaultDropdownItem from '../BaseDropdown/DefaultDropdownItem';
import Dropdown from '../BaseDropdown';
import styles from './index.module.css';
import Ellipsis from '../Ellipsis';

type BaseDatePeriodDropdownProps = {
	children: React.ReactElement<{ isOpen?: boolean }>;
	handleClick: (range?: EnabledRange) => void;
	preSelectedValue: TimeRange;
};

export default function BaseDatePeriodDropdown({
	children,
	handleClick,
	preSelectedValue,
}: BaseDatePeriodDropdownProps) {
	const { ranges } = useDateRangeDropdown({
		preSelectedValue: preSelectedValue,
		handleClick: handleClick,
	});

	//Build the dropdown items
	const items: DropdownItem[] = useMemo(
		() =>
			ranges.map((r, i) => ({
				id: `${r.label}-${i}`,
				onClick: () => handleClick(r),
				customContent: (
					<DefaultDropdownItem className={styles.innerContainer}>
						<Ellipsis>
							<span>{r.label}</span>
						</Ellipsis>
						<div className={styles.right}>{r.formattedRange}</div>
					</DefaultDropdownItem>
				),
			})),
		[ranges, handleClick],
	);

	return (
		<Dropdown items={items} align="left" closeDropdownOnItemClick={true}>
			{children}
		</Dropdown>
	);
}
