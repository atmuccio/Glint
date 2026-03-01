import { ZoneTheme } from '../core/tokens/zone-theme.model';
import { mergeZoneThemes } from '../core/utils/merge-zone-themes';
import { GlintColor } from '../core/palette/colors/index';
import { GlintSpacing } from '../core/palette/spacing';
import { GlintRadius } from '../core/palette/radius';
import { GlintShadow } from '../core/palette/shadows';
import { GlintDuration } from '../core/palette/animation';
import { GlintFontSize } from '../core/palette/typography';

/**
 * Dark theme zone preset.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="DARK_ZONE">
 *   <glint-card>Dark themed content</glint-card>
 * </glint-style-zone>
 * ```
 */
export const DARK_ZONE: Partial<ZoneTheme> = {
  colorPrimary: GlintColor.Blue.S400,
  colorPrimaryContrast: GlintColor.White,
  colorSecondary: GlintColor.Slate.S400,
  colorSecondaryContrast: GlintColor.White,
  colorSurface: GlintColor.Slate.S900,
  colorSurfaceVariant: GlintColor.Slate.S800,
  colorText: GlintColor.Slate.S50,
  colorTextMuted: GlintColor.Slate.S400,
  colorBorder: GlintColor.Slate.S700,
  colorFocusRing: GlintColor.Blue.S400,
  shadow: GlintShadow.None,
};

/**
 * Compact density zone preset — reduced spacing.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="COMPACT_ZONE">
 *   <glint-button>Compact button</glint-button>
 * </glint-style-zone>
 * ```
 */
export const COMPACT_ZONE: Partial<ZoneTheme> = {
  spacingXs: GlintSpacing.None,
  spacingSm: GlintSpacing.Xs,
  spacingMd: GlintSpacing.Sm,
  spacingLg: GlintSpacing.Md,
  spacingXl: GlintSpacing.Lg,
  fontSize: GlintFontSize.Sm,
};

/**
 * Danger/destructive zone preset — red accent for dangerous actions.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="DANGER_ZONE">
 *   <glint-button severity="primary">Delete All</glint-button>
 * </glint-style-zone>
 * ```
 */
export const DANGER_ZONE: Partial<ZoneTheme> = {
  colorPrimary: GlintColor.Red.S500,
  colorPrimaryContrast: GlintColor.White,
  colorFocusRing: GlintColor.Red.S400,
};

/**
 * Soft/rounded zone preset — larger radii and lighter shadows.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="SOFT_ZONE">
 *   <glint-card>Soft, rounded card</glint-card>
 * </glint-style-zone>
 * ```
 */
export const SOFT_ZONE: Partial<ZoneTheme> = {
  borderRadius: GlintRadius.Xl,
  shadow: GlintShadow.Md,
  durationNormal: GlintDuration.Slow,
};

/**
 * Pre-composed dark + compact zone preset.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="DARK_COMPACT_ZONE">
 *   <glint-button>Dark & compact</glint-button>
 * </glint-style-zone>
 * ```
 */
export const DARK_COMPACT_ZONE: Partial<ZoneTheme> = mergeZoneThemes(DARK_ZONE, COMPACT_ZONE);
