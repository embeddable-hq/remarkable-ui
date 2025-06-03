// Third Party Libraries
import React, { useState } from "react";

// Local Libraries
import { CheckboxIcon, CheckboxSelectedIcon } from "../../../constants/icons";
import { MultiSelectDropdownProps } from "./MultiSelectDropdown.emb";
import ControlCard from "../../../shared/ControlCard";
import Dropdown, { DropdownItem } from "../../../shared/BaseDropdown";
import DropdownButton from "../../../shared/DropdownButton";
import Ellipsis from "../../../shared/Ellipsis";
import styles from "./index.module.css";

export default ({
	description,
	dimension,
	onChangeSelectedValues,
	placeholder,
	preSelectedValues,
	results,
	setSearchValue,
	title,
}: MultiSelectDropdownProps) => {
	const [selected, setSelected] = useState(() => new Set(preSelectedValues));

	const { isLoading, data = [], error } = results;

	const preSelectedValuesList = preSelectedValues ?? [];
	const selectedValues = Array.from(selected);

	//check if the selected values are the same as the pre-selected values, and if so, disable the apply button
	const disableApplyButton =
		isLoading ||
		(selectedValues.length === preSelectedValuesList.length &&
			selectedValues.every((v) => preSelectedValuesList.includes(v)));

	//toggle the values as users select/deselect values
	const toggleValue = (value: string) => {
		setSelected((prev) => {
			const next = new Set(prev); // make a *new* Set (don’t mutate)
			next.has(value) ? next.delete(value) : next.add(value);
			return next;
		});
	};

	//clear the selected values and send the empty array to Embeddable
	const clearSelectedValues = () => {
		setSelected(new Set());
		onChangeSelectedValues?.([]);
	};

	//send the selected values to Embeddable when the users clicks the apply button
	const handleApplyClick = () => {
		onChangeSelectedValues?.(selectedValues as string[]);
	};

	//Populate dropdown items
	const dropdownItems =
		data.length > 0
			? data.map((row, i) => {
					const label = row[dimension.name];
					return {
						id: `multi-select-dropdown-${label}-${i}`,
						label: `${label}`,
						icon: selected.has(label) ? CheckboxSelectedIcon : CheckboxIcon,
						onClick: () => toggleValue(label),
					};
				})
			: ([
					{
						//'No results' item
						id: `multi-select-dropdown-no-results`,
						label: `No results found`,
					},
				] as DropdownItem[]);

	return (
		<ControlCard title={title} description={description} errorMessage={error}>
			<Dropdown
				items={dropdownItems}
				align="left"
				closeDropdownOnItemClick={false}
				onSearch={setSearchValue}
				onApply={handleApplyClick}
				disableApply={disableApplyButton}
			>
				<DropdownButton
					clearSelectedValues={clearSelectedValues}
					isLoading={isLoading}
					selectedValues={selectedValues}
					placeholder={placeholder}
					isOpenText={`${dimension.title} (${selectedValues.length})`}
					isClosedText={
						<>
							<Ellipsis>{selectedValues.join(", ")}</Ellipsis>
							<span className={styles.dropdownCount}>
								({selectedValues.length})
							</span>
						</>
					}
				/>
			</Dropdown>
		</ControlCard>
	);
};
