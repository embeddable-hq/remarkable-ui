import React from 'react';
import { ExportIcon } from '../../constants/icons';
import Dropdown from '../BaseDropdown';
import IconButton from '../IconButton';
import { useTheme } from '@embeddable.com/react';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { useExportItems } from './useExportItems';
import { ExportConfig } from './nativeOptions';

export type ExportButtonProps = {
	setLocalLoading: React.Dispatch<React.SetStateAction<boolean>>;
	exportConfig?: ExportConfig;
};

export default function ExportButton({ setLocalLoading, exportConfig }: ExportButtonProps) {
	const items = useExportItems(exportConfig, setLocalLoading);

	if (items.length === 0) return null;

	return (
		<Dropdown items={items} align="right">
			<IconButton icon={ExportIcon} />
		</Dropdown>
	);
}
