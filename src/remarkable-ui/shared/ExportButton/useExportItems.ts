import { useMemo } from 'react';
import { DataResponse, Dimension, Measure } from '@embeddable.com/core';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { DropdownItem } from '../BaseDropdown';
import { nativeExportOptions, ExportOptionKey } from './nativeOptions';

export type ExportConfig = {
	dataToExport?: DataResponse['data'];
	dimensions?: Dimension[];
	measures?: Measure[];
	title?: string;
	enabledOptions?: Record<ExportOptionKey, boolean>;
};

const DEFAULT_EXPORT_CONFIG: ExportConfig = {
	dataToExport: [],
	dimensions: [],
	measures: [],
	title: '',
	enabledOptions: {} as Record<ExportOptionKey, boolean>,
};

export function useExportItems(
	config: ExportConfig = DEFAULT_EXPORT_CONFIG,
	theme: Theme,
	setLocalLoading: React.Dispatch<React.SetStateAction<boolean>>,
): DropdownItem[] {
	const { dataToExport, dimensions, measures, title, enabledOptions } = config;

	// array of native export option keys that are toggled on. It could be empty.
	const enabledKeys = (Object.keys(nativeExportOptions) as ExportOptionKey[]).filter(
		(key) => enabledOptions && enabledOptions[key],
	);

	// array of dropdown items to show, generated from the enabled keys and the theme's custom export options
	return useMemo(() => {
		const items = enabledKeys
			.map((key) => nativeExportOptions[key])
			.concat(theme.customExportOptions ?? [])
			.map((opt) => ({
				...opt,
				fn: () => opt.fn(dataToExport, dimensions, measures, title),
			}))
			.map(({ id, label, icon, fn }) => ({
				id,
				label,
				icon,
				onClick: () => {
					//1. set loading to true, 2. run the export function, 3. then set loading to false
					setLocalLoading(true);
					Promise.resolve(fn()).finally(() => setLocalLoading(false));
				},
			}));

		return items;
	}, [
		enabledKeys,
		theme.customExportOptions,
		dataToExport,
		dimensions,
		measures,
		title,
		setLocalLoading,
	]);
}
