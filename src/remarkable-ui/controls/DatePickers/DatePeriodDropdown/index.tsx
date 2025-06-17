// Third Party Libraries
import React, { useState } from 'react';

// Local Libraries
import { DatePeriodDropdownProps } from './DatePeriodDropdown.emb';
import { EnabledRange } from '../../../utils/relativeDateRanges';
import ControlCard from '../../../shared/ControlCard';
import DropdownButton from '../../../shared/DropdownButton';
import BaseDatePeriodDropdown from '../../../shared/BaseDatePeriodDropdown';

export default function DatePeriodDropdown({
	description,
	onChangeSelectedValue,
	placeholder,
	preSelectedValue,
	title,
}: DatePeriodDropdownProps) {
	const [selected, setSelected] = useState<EnabledRange | undefined>();

	const handleClick = (range?: EnabledRange) => {
		//When there's no range, clear the selected value and pass undefined to Embeddable
		if (!range || !range.from || !range.to) {
			setSelected(undefined);
			onChangeSelectedValue(undefined);
			return;
		}
		//When there's a range, set the selected value and pass the range to Embeddable
		setSelected(range);
		onChangeSelectedValue({
			from: range.from,
			to: range.to,
			relativeTimeString: range.label,
		});
	};

	return (
		<ControlCard title={title} description={description}>
			<BaseDatePeriodDropdown handleClick={handleClick} preSelectedValue={preSelectedValue}>
				<DropdownButton
					clearSelectedValues={handleClick}
					selectedValues={selected?.label}
					placeholder={placeholder}
					isOpenText={selected?.label}
					isClosedText={selected?.label}
				/>
			</BaseDatePeriodDropdown>
		</ControlCard>
	);
}
