import {
  stylesTokensComponents,
  StylesTokensComponentsKeys,
} from './styles.tokensComponents.constants';
import { stylesTokensCore, StylesTokensCoreKeys } from './styles.tokensCore.constants';
import { stylesTokensSemantic, StylesTokensSemanticKeys } from './styles.tokensSemantic.constants';

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
