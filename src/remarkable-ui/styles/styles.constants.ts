import { stylesTokensCore } from './styles.tokensCore.constants';
import { stylesTokensSemantic } from './styles.tokensSemantic.constants';
import { stylesTokensComponents } from './styles.tokensComponents.constants';

type StylesTokensCore = Record<keyof typeof stylesTokensCore, string>;
type StylesTokensSemantic = Record<keyof typeof stylesTokensSemantic, string>;
type StylesTokensComponents = Record<keyof typeof stylesTokensComponents, string>;

export type Styles = StylesTokensCore & StylesTokensSemantic & StylesTokensComponents;

export const styles: Styles = {
  ...stylesTokensCore,
  ...stylesTokensSemantic,
  ...stylesTokensComponents,
};

export type StylesKeys = keyof typeof styles;
