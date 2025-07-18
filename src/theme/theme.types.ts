import {
  themeBaseVariables,
  themeComponentVariables,
  themeSemanticVariables,
} from './theme.constants';

type ThemeBaseVariables = Record<keyof typeof themeBaseVariables, string>;
type ThemeSemanticVariables = Record<keyof typeof themeSemanticVariables, string>;
type ThemeComponentVariables = Record<keyof typeof themeComponentVariables, string>;

export type ThemeCssVariables = ThemeBaseVariables &
  ThemeSemanticVariables &
  ThemeComponentVariables &
  Record<string, string>;

export type Theme = {
  charts: {
    colors: string[];
    borderColors?: string[];
    legendPosition?: 'top' | 'right' | 'bottom' | 'left';
  };
  // TODO: add as we go
  styles: ThemeCssVariables;
};
