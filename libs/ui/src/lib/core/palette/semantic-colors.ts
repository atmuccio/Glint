import { CSSColor } from '../types/branded';
import { Blue } from './colors/blue';
import { Green } from './colors/green';
import { Amber } from './colors/amber';
import { Red } from './colors/red';

/**
 * Semantic color aliases for common UI states.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ colorPrimary: GlintSemanticColor.Danger }">
 * ```
 */
export const GlintSemanticColor = {
  /** Informational content */
  Info: Blue.S500 as CSSColor,
  /** Success / positive state */
  Success: Green.S500 as CSSColor,
  /** Warning / caution state */
  Warning: Amber.S500 as CSSColor,
  /** Danger / destructive state */
  Danger: Red.S500 as CSSColor,
} as const;
