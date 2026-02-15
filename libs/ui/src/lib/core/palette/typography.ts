import { CSSFontFamily, CSSLength } from '../types/branded';

/**
 * Font family presets.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ fontFamily: GlintFont.Mono }">
 * ```
 */
export const GlintFont = {
  Sans: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif" as CSSFontFamily,
  Serif: "Georgia, Cambria, 'Times New Roman', Times, serif" as CSSFontFamily,
  Mono: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace" as CSSFontFamily,
} as const;

/**
 * Font size scale.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ fontSize: GlintFontSize.Lg }">
 * ```
 */
export const GlintFontSize = {
  /** 0.75rem (12px) */
  Xs: '0.75rem' as CSSLength,
  /** 0.875rem (14px) */
  Sm: '0.875rem' as CSSLength,
  /** 1rem (16px) */
  Md: '1rem' as CSSLength,
  /** 1.125rem (18px) */
  Lg: '1.125rem' as CSSLength,
  /** 1.25rem (20px) */
  Xl: '1.25rem' as CSSLength,
  /** 1.5rem (24px) */
  Xxl: '1.5rem' as CSSLength,
} as const;

/**
 * Font weight presets.
 */
export const GlintFontWeight = {
  Light: '300',
  Normal: '400',
  Medium: '500',
  Semibold: '600',
  Bold: '700',
} as const;
