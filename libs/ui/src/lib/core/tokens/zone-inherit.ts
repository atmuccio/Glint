import { CSSColor, CSSLength, CSSBorderRadius, CSSShadow, CSSFontFamily, CSSDuration } from '../types/branded';

/**
 * Sentinel type that is assignable to all branded CSS value types.
 * Used by ZONE_INHERIT to be compatible with any ZoneTheme property.
 */
export type ZoneInheritSentinel = CSSColor &
  CSSLength &
  CSSBorderRadius &
  CSSShadow &
  CSSFontFamily &
  CSSDuration;

/**
 * Sentinel value for unsetting a zone theme property.
 *
 * When a property is set to ZONE_INHERIT, StyleZoneComponent calls
 * `style.removeProperty()` instead of `style.setProperty()`, causing
 * the value to fall back to the nearest ancestor zone or the
 * CSS @property initial-value.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ colorPrimary: ZONE_INHERIT }">
 *   <!-- colorPrimary falls back to parent zone or global default -->
 * </glint-style-zone>
 * ```
 */
export const ZONE_INHERIT: ZoneInheritSentinel = Symbol('ZONE_INHERIT') as unknown as ZoneInheritSentinel;
