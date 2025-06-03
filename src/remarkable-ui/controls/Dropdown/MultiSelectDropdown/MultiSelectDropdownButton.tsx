// Third Party Libraries
import React from "react";

// Embeddable Libraries
import { Dimension } from "@embeddable.com/core";

// Local Libraries
import styles from "./index.module.css";
import Spinner from "../../../shared/Spinner";
import { DropdownArrow, CloseIcon } from "../../../constants/icons";

type MultiSelectDropdownButtonProps = {
	dimension: Dimension;
	placeholder?: string;
	isLoading?: boolean;
	isOpen?: boolean;
	selectedValues?: string[];
	clearSelectedValues: () => void;
};

export default function MultiSelectDropdownButton({
	dimension,
	placeholder = "",
	isLoading = false,
	isOpen = false,
	selectedValues = [],
	clearSelectedValues,
}: MultiSelectDropdownButtonProps) {
	const count = selectedValues.length;

	const handleClearSelectedValues = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		clearSelectedValues();
	};

	return (
		<button className={styles.dropdownButton}>
			<div className={styles.dropdownButtonText}>
				{count > 0 ? (
					isOpen ? (
						`${dimension.title} (${count})`
					) : (
						<>
							<span className={styles.dropdownButtonItems}>
								{selectedValues.join(", ")}
							</span>
							<span className={styles.dropdownButtonCount}>({count})</span>
						</>
					)
				) : (
					placeholder
				)}
			</div>
			{count > 0 && (
				<div
					className={styles.dropdownButtonSelectedValues}
					onClick={handleClearSelectedValues}
					title="Clear selection"
				>
					<CloseIcon />
				</div>
			)}
			<div className={styles.dropdownButtonIconContainer}>
				{isLoading ? <Spinner /> : <DropdownArrow />}
			</div>
		</button>
	);
}
