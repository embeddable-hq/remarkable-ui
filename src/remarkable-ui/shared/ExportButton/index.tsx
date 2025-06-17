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

export type ExportOption = {
	id: string;
	label: string;
	icon?: React.FC<React.SVGProps<SVGSVGElement>>;
	fn: (data?: DataResponse['data']) => void;
};

const handleDownload = (data: DataResponse['data']) => {
	alert('dowload csv!');
};

export default function ExportButton({ setLocalLoading, data }: ExportButtonProps) {
	const theme = useTheme() as Theme;

	const handleClick = (onClick: () => void) => {
		setLocalLoading(true);
		Promise.resolve(onClick()).then(() => setLocalLoading(false));
	};

	const rawOptions = [
		{
			id: 'downloadCSV',
			label: 'Download CSV',
			icon: DownloadCSVIcon,
			fn: () => handleDownload(data),
		},
		{
			id: 'downloadPNG',
			label: 'Download PNG',
			icon: DownloadPNGIcon,
			fn: () => alert('download png!'),
		},
		// include theme.customExportOptions, turning the onClick(data) into fn()
		...(theme.customExportOptions ?? []).map((opt) => ({
			...opt,
			fn: () => opt.fn(data),
		})),
	];

	const items: DropdownItem[] = rawOptions.map(({ id, label, icon, fn }) => ({
		id,
		label,
		icon,
		onClick: () => handleClick(fn),
	}));

	return (
		<Dropdown items={items} align="right">
			<IconButton icon={ExportIcon} />
		</Dropdown>
	);
}
