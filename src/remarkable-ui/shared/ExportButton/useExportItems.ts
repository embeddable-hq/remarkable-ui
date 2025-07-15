import { useMemo } from 'react';
import { Theme } from '../../../themes/remarkableTheme/theme';
import { DropdownItem } from '../BaseDropdown';
import { nativeExportOptions, ExportOptionKey, ExportOption } from './nativeOptions';
import { ExportConfig } from './nativeOptions';
import { useTheme } from '@embeddable.com/react';
import useI18n from '../../hooks/useI18n';

const DEFAULT_EXPORT_CONFIG: ExportConfig = {
	dataToExport: [],
	dimensions: [],
	measures: [],
	title: 'export',
	enabledOptions: {} as Partial<Record<ExportOptionKey, boolean | undefined>>,
};

export function useExportItems(
	config: ExportConfig = DEFAULT_EXPORT_CONFIG,
	setLocalLoading: React.Dispatch<React.SetStateAction<boolean>>,
): DropdownItem[] {
	const theme = useTheme() as Theme;
	const i18n = useI18n(theme);
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
				label:  i18n.text(label),
				icon,
				onClick: () => {
					//1. set loading to true, 2. run the export function, 3. then set loading to false
					setLocalLoading(true);
					//Because certain options (like export png) jump straight into heavy DOM reads/writes and canvas drawing, it can delay the loader showing. We add a timeout to make the sure . We add a timeout to ensure that the loading state is set to true before the export function is called
					setTimeout(() => {
						Promise.resolve(fn(config)).finally(() => setLocalLoading(false));
					}, 0);
				},
			}));

		return items;
	}, [enabledKeys, theme.customExportOptions, setLocalLoading]);
}
