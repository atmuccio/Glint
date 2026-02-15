import { CSSLength } from '../types/branded';

/**
 * Spacing scale for padding, margin, and gap values.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ spacingMd: GlintSpacing.Lg }">
 * ```
 */
export const GlintSpacing = {
  /** 0px */
  None: '0px' as CSSLength,
  /** 0.25rem (4px) */
  Xs: '0.25rem' as CSSLength,
  /** 0.5rem (8px) */
  Sm: '0.5rem' as CSSLength,
  /** 0.75rem (12px) */
  Md: '0.75rem' as CSSLength,
  /** 1rem (16px) */
  Lg: '1rem' as CSSLength,
  /** 1.5rem (24px) */
  Xl: '1.5rem' as CSSLength,
  /** 2rem (32px) */
  Xxl: '2rem' as CSSLength,
} as const;
