// Third Party Libraries
import React from 'react';

// Local Libraries
import styles from './index.module.css';
import Spinner from '../Spinner';
import { DropdownArrow, CloseIcon } from '../../constants/icons';
import Ellipsis from '../Ellipsis';

type DropdownButtonProps = {
	clearSelectedValues: () => void;
	isClosedText?: string | React.ReactNode;
	isLoading?: boolean;
	isOpen?: boolean;
	isOpenText?: string | React.ReactNode;
	placeholder?: string;
	selectedValues?: string | string[];
};

export default function DropdownButton({
	clearSelectedValues,
	isClosedText,
	selectedValues,
	isLoading = false,
	isOpen = false,
	isOpenText,
	placeholder = '',
}: DropdownButtonProps) {
	const handleClearSelectedValues = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		clearSelectedValues();
	};

	const hasSelectedValues = selectedValues && selectedValues.length > 0;

	const wrapEllipsis = (value: string | React.ReactNode) => {
		if (typeof value === 'string') {
			return <Ellipsis>{value}</Ellipsis>;
		}
		return value;
	};

	return (
		<button className={styles.dropdownButton}>
			<div className={styles.dropdownButtonText}>
				{hasSelectedValues
					? isOpen
						? wrapEllipsis(isOpenText)
						: wrapEllipsis(isClosedText)
					: wrapEllipsis(placeholder)}
			</div>
			{hasSelectedValues && (
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
