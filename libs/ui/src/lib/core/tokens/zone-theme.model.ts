import { CSSBorderRadius, CSSColor, CSSDuration, CSSFontFamily, CSSLength, CSSShadow } from '../types/branded';
import { GlintColor } from '../palette/colors/index';
import { GlintSemanticColor } from '../palette/semantic-colors';
import { GlintSpacing } from '../palette/spacing';
import { GlintRadius } from '../palette/radius';
import { GlintShadow } from '../palette/shadows';
import { GlintFont, GlintFontSize, GlintFontWeight } from '../palette/typography';
import { GlintDuration, GlintEasing } from '../palette/animation';

/**
 * Theme token interface for Style Zones.
 *
 * Visual tokens use branded CSS types for compile-time safety.
 * Behavioral tokens use literal unions for IDE autocomplete.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{
 *   colorPrimary: GlintColor.Blue.S500,
 *   colorPrimaryContrast: GlintColor.White,
 *   borderRadius: GlintRadius.Lg
 * }">
 * ```
 */
export interface ZoneTheme {
  // ── Color tokens ──────────────────────────────────────────
  colorPrimary: CSSColor;
  colorPrimaryContrast: CSSColor;
  colorSecondary: CSSColor;
  colorSecondaryContrast: CSSColor;
  colorSurface: CSSColor;
  colorSurfaceVariant: CSSColor;
  colorText: CSSColor;
  colorTextMuted: CSSColor;
  colorBorder: CSSColor;
  colorFocusRing: CSSColor;
  colorError: CSSColor;
  colorSuccess: CSSColor;
  colorWarning: CSSColor;

  // ── Spacing tokens ────────────────────────────────────────
  spacingXs: CSSLength;
  spacingSm: CSSLength;
  spacingMd: CSSLength;
  spacingLg: CSSLength;
  spacingXl: CSSLength;

  // ── Shape tokens ──────────────────────────────────────────
  borderRadius: CSSBorderRadius;
  shadow: CSSShadow;

  // ── Typography tokens ─────────────────────────────────────
  fontFamily: CSSFontFamily;
  fontSize: CSSLength;
  fontWeight: string;

  // ── Animation tokens ──────────────────────────────────────
  durationFast: CSSDuration;
  durationNormal: CSSDuration;
  durationSlow: CSSDuration;
  easing: string;

  // ── Behavioral tokens ─────────────────────────────────────
  defaultVariant: 'filled' | 'outlined' | 'ghost';
}

/**
 * Default theme values used as CSS @property initial-values
 * and as the root zone fallback.
 */
export const DEFAULT_ZONE_THEME: ZoneTheme = {
  // Colors
  colorPrimary: GlintColor.Slate.S950,
  colorPrimaryContrast: GlintColor.White,
  colorSecondary: '#f1f5f9' as CSSColor,
  colorSecondaryContrast: GlintColor.Slate.S500,
  colorSurface: GlintColor.White,
  colorSurfaceVariant: GlintColor.Slate.S50,
  colorText: GlintColor.Slate.S900,
  colorTextMuted: GlintColor.Slate.S500,
  colorBorder: GlintColor.Slate.S300,
  colorFocusRing: GlintColor.Blue.S400,
  colorError: GlintSemanticColor.Danger,
  colorSuccess: GlintSemanticColor.Success,
  colorWarning: GlintSemanticColor.Warning,

  // Spacing
  spacingXs: GlintSpacing.Xs,
  spacingSm: GlintSpacing.Sm,
  spacingMd: GlintSpacing.Md,
  spacingLg: GlintSpacing.Lg,
  spacingXl: GlintSpacing.Xl,

  // Shape
  borderRadius: GlintRadius.Md,
  shadow: GlintShadow.Md,

  // Typography
  fontFamily: GlintFont.Sans,
  fontSize: GlintFontSize.Md,
  fontWeight: GlintFontWeight.Normal,

  // Animation
  durationFast: GlintDuration.Fast,
  durationNormal: GlintDuration.Normal,
  durationSlow: GlintDuration.Slow,
  easing: GlintEasing.Standard,

  // Behavioral
  defaultVariant: 'filled',
};

/**
 * Maps ZoneTheme keys to CSS custom property names.
 *
 * Used by StyleZoneComponent to sync theme values to CSS
 * and by registerGlintTokens() for @property registration.
 */
export const THEME_TO_CSS_MAP: Record<string, string> = {
  colorPrimary: '--glint-color-primary',
  colorPrimaryContrast: '--glint-color-primary-contrast',
  colorSecondary: '--glint-color-secondary',
  colorSecondaryContrast: '--glint-color-secondary-contrast',
  colorSurface: '--glint-color-surface',
  colorSurfaceVariant: '--glint-color-surface-variant',
  colorText: '--glint-color-text',
  colorTextMuted: '--glint-color-text-muted',
  colorBorder: '--glint-color-border',
  colorFocusRing: '--glint-color-focus-ring',
  colorError: '--glint-color-error',
  colorSuccess: '--glint-color-success',
  colorWarning: '--glint-color-warning',
  spacingXs: '--glint-spacing-xs',
  spacingSm: '--glint-spacing-sm',
  spacingMd: '--glint-spacing-md',
  spacingLg: '--glint-spacing-lg',
  spacingXl: '--glint-spacing-xl',
  borderRadius: '--glint-border-radius',
  shadow: '--glint-shadow',
  fontFamily: '--glint-font-family',
  fontSize: '--glint-font-size',
  fontWeight: '--glint-font-weight',
  durationFast: '--glint-duration-fast',
  durationNormal: '--glint-duration-normal',
  durationSlow: '--glint-duration-slow',
  easing: '--glint-easing',
};

/**
 * Defines the CSS @property syntax for each token category.
 * Used by registerGlintTokens() for type-safe registration.
 */
export const TOKEN_SYNTAX_MAP: Record<string, string> = {
  colorPrimary: '<color>',
  colorPrimaryContrast: '<color>',
  colorSecondary: '<color>',
  colorSecondaryContrast: '<color>',
  colorSurface: '<color>',
  colorSurfaceVariant: '<color>',
  colorText: '<color>',
  colorTextMuted: '<color>',
  colorBorder: '<color>',
  colorFocusRing: '<color>',
  colorError: '<color>',
  colorSuccess: '<color>',
  colorWarning: '<color>',
  spacingXs: '<length>',
  spacingSm: '<length>',
  spacingMd: '<length>',
  spacingLg: '<length>',
  spacingXl: '<length>',
  borderRadius: '<length-percentage>',
  shadow: '*',
  fontFamily: '*',
  fontSize: '<length>',
  fontWeight: '<number>',
  durationFast: '<time>',
  durationNormal: '<time>',
  durationSlow: '<time>',
  easing: '*',
};

/** Keys that are behavioral (not CSS custom properties) */
export const BEHAVIORAL_KEYS: ReadonlySet<string> = new Set(['defaultVariant']);
