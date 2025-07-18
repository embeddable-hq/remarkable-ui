import {
  themeColors,
  themeSpacingAndSizes,
  themeBorders,
  themeComponents,
  themeTypography,
} from './theme.constants';

type ThemeColors = Record<keyof typeof themeColors, string>;
type ThemeSpacingAndSizes = Record<keyof typeof themeSpacingAndSizes, string>;
type ThemeBorders = Record<keyof typeof themeBorders, string>;
type ThemeComponents = Record<keyof typeof themeComponents, string>;
type ThemeTypography = Record<keyof typeof themeTypography, string>;

export type ThemeStyles = ThemeColors &
  ThemeSpacingAndSizes &
  ThemeBorders &
  ThemeComponents &
  ThemeTypography &
  Record<string, string>;

export type Theme = {
  charts: {
    colors: string[];
    borderColors?: string[];
    legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  };
  // TODO: add as we go
  styles: ThemeStyles;
};
