import { useMemo } from 'react';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { DropdownItem } from '../BaseDropdown';
import { nativeExportOptions, ExportOptionKey, ExportOption } from './nativeOptions';

// This is the config object that is passed through from each component, containing the key information needed to export.
export type ExportConfig = {
	dataToExport?: DataResponse['data'];
	dimensions?: Dimension[];
	measures?: Measure[];
	title?: string;
	enabledOptions?: Partial<Record<ExportOptionKey, boolean | undefined>>;
	containerRef?: React.RefObject<HTMLDivElement | null>;
};

const DEFAULT_EXPORT_CONFIG: ExportConfig = {
	dataToExport: [],
	dimensions: [],
	measures: [],
	title: '',
	enabledOptions: {} as Partial<Record<ExportOptionKey, boolean | undefined>>,
};

export function useExportItems(
	config: ExportConfig = DEFAULT_EXPORT_CONFIG,
	theme: Theme,
	setLocalLoading: React.Dispatch<React.SetStateAction<boolean>>,
): DropdownItem[] {
	const { enabledOptions } = config;

	// array of native export option keys that are toggled on. It could be empty.
	const enabledKeys = (Object.keys(nativeExportOptions) as ExportOptionKey[]).filter(
		(key) => enabledOptions && enabledOptions[key],
	);

	// Create the dropdown items from the enabled native export options and the theme's custom export options
	return useMemo(() => {
		const items = enabledKeys
			.map((key) => nativeExportOptions[key]) // get the native export options
			.concat((theme.customExportOptions as ExportOption[]) ?? []) // add the custom export options from the theme
			.map(({ id, label, icon, fn }) => ({
				//create the dropdownItem object
				id,
				label,
				icon,
				onClick: () => {
					//1. set loading to true, 2. run the export function, 3. then set loading to false
					setLocalLoading(true);
					Promise.resolve(fn(config)).finally(() => setLocalLoading(false));
				},
			}));

		return items;
	}, [enabledKeys, theme.customExportOptions, setLocalLoading]);
}
