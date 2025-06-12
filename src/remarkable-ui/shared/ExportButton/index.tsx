import React from 'react';
import { ExportIcon, DownloadCSVIcon, DownloadPNGIcon } from '../../constants/icons';
import Dropdown from '../BaseDropdown';
import IconButton from '../IconButton';
import { DropdownItem } from '../BaseDropdown';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { useTheme } from '@embeddable.com/react';
import { DataResponse } from '@embeddable.com/core';

type SetBoolean = React.Dispatch<React.SetStateAction<boolean>>;

type ExportButtonProps = {
	setLocalLoading: SetBoolean;
	data?: DataResponse['data'];
};

const handleDownload = (data: DataResponse['data']) => {
	alert('dowload csv!');
};

export default function ExportButton({ setLocalLoading, data }: ExportButtonProps) {
	const theme = useTheme() as Theme;

	const handleClick = (onClick: () => void | Promise<void>) => {
		setLocalLoading(true);
		Promise.resolve(onClick()).then(() => setLocalLoading(false));
	};

	const customExportOptions =
		theme.customExportOptions?.map((option) => ({
			...option,
			onClick: () => handleClick(() => option.onClick?.(data)),
		})) || ([] as DropdownItem[]);

	const downloadCSV: DropdownItem = {
		id: 'downloadCSV',
		label: 'Download CSV',
		icon: DownloadCSVIcon,
		onClick: () => handleClick(() => handleDownload(data)),
	};

	const downloadPNG: DropdownItem = {
		id: 'downloadPNG',
		label: 'Download PNG',
		icon: DownloadPNGIcon,
		onClick: () => handleClick(() => alert('dowload png!')),
	};

	const veryLongOption: DropdownItem = {
		id: 'something',
		label: 'Something way too long has to go here for testing',
		icon: DownloadPNGIcon,
		onClick: () => alert('dowload png!'),
	};

	const items = [downloadCSV, downloadPNG, ...customExportOptions];

	return (
		<Dropdown items={items} align="right">
			<IconButton icon={ExportIcon} />
		</Dropdown>
	);
}
