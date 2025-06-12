// Third Party Libraries
import React from 'react';

//Local Libraries
import styles from './index.module.css';
import PrimaryButton from '../PrimaryButton';

type ApplyButton = {
	onApply: () => void;
	disableApply?: boolean;
	handleButtonKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
};

export default function ApplyButton({ onApply, disableApply, handleButtonKeyDown }: ApplyButton) {
	return (
		<div className={styles.applyButtonContainer}>
			<PrimaryButton
				onClick={() => onApply()}
				disabled={!!disableApply}
				fullWidth
				handleButtonKeyDown={handleButtonKeyDown}
			>
				Apply
			</PrimaryButton>
		</div>
	);
}
