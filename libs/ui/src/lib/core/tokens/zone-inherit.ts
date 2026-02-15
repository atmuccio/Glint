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
export const ZONE_INHERIT = Symbol('ZONE_INHERIT') as unknown as any;
