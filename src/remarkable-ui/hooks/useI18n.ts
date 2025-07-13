import { I18nFormatter, Theme } from "../../themes/remarkableTheme/theme";

const useI18n = (theme: Theme): I18nFormatter => {
    return theme.i18n.i18nFormatter(theme);
}
    
export default useI18n;