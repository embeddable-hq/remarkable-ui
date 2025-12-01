import {
  stylesTokensComponents,
  StylesTokensComponentsKeys,
  stylesTokensCore,
  StylesTokensCoreKeys,
  stylesTokensSemantic,
  StylesTokensSemanticKeys,
} from './global.tokens';

type StylesTokensCore = Record<StylesTokensCoreKeys, string>;
type StylesTokensSemantic = Record<StylesTokensSemanticKeys, string>;
type StylesTokensComponents = Record<StylesTokensComponentsKeys, string>;

export type Styles = StylesTokensCore & StylesTokensSemantic & StylesTokensComponents;

export const styles: Styles = {
  ...stylesTokensCore,
  ...stylesTokensSemantic,
  ...stylesTokensComponents,
};

export type StylesKeys = keyof typeof styles;
