// Third Party Libraries
import React, { useState } from 'react';

// Local Libraries
import { SingleSelectDropdownProps } from './SingleSelectDropdown.emb';
import ControlCard from '../../../shared/ControlCard';
import Dropdown, { DropdownItem } from '../../../shared/BaseDropdown';
import DropdownButton from '../../../shared/DropdownButton';

export default function SingleSelectDropdown({
	description,
	dimension,
	onChangeSelectedValue,
	placeholder,
	results,
	preSelectedValue,
	setSearchValue,
	title,
}: SingleSelectDropdownProps) {
	const [selected, setSelected] = useState(preSelectedValue);
	const { isLoading, data = [], error } = results;

	const handleClick = (value: string) => {
		setSelected(value);
		onChangeSelectedValue?.(value);
	};

	//Populate dropdown items
	const dropdownItems =
		data.length > 0
			? data.map((row, i) => {
					const label = row[dimension.name];
					return {
						id: `singleselect-dropdown-${label}-${i}`,
						label: `${label}`,
						onClick: () => handleClick(label),
					};
				})
			: ([
					{
						//'No results' item
						id: `single-select-dropdown-no-results`,
						label: `No results found`,
					},
				] as DropdownItem[]);

	return (
		<ControlCard title={title} description={description} errorMessage={error}>
			<Dropdown
				items={dropdownItems}
				align="left"
				closeDropdownOnItemClick={true}
				onSearch={setSearchValue}
			>
				<DropdownButton
					clearSelectedValues={() => handleClick('')}
					isLoading={isLoading}
					selectedValues={selected}
					placeholder={placeholder}
					isOpenText={selected}
					isClosedText={selected}
				/>
			</Dropdown>
		</ControlCard>
	);
}
