import { CSSBorderRadius } from '../types/branded';

/**
 * Border radius scale.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ borderRadius: GlintRadius.Lg }">
 * ```
 */
export const GlintRadius = {
  /** 0px — sharp corners */
  None: '0px' as CSSBorderRadius,
  /** 0.125rem (2px) */
  Sm: '0.125rem' as CSSBorderRadius,
  /** 0.375rem (6px) */
  Md: '0.375rem' as CSSBorderRadius,
  /** 0.5rem (8px) */
  Lg: '0.5rem' as CSSBorderRadius,
  /** 0.75rem (12px) */
  Xl: '0.75rem' as CSSBorderRadius,
  /** 9999px — fully rounded / pill */
  Full: '9999px' as CSSBorderRadius,
} as const;
