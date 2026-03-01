import { ZoneTheme } from '../tokens/zone-theme.model';

/**
 * Merges multiple partial zone themes left-to-right.
 * Later themes override earlier ones. Useful for composing presets.
 *
 * @example
 * ```typescript
 * const DARK_COMPACT = mergeZoneThemes(DARK_ZONE, COMPACT_ZONE);
 * ```
 */
export function mergeZoneThemes(
  ...themes: Partial<ZoneTheme>[]
): Partial<ZoneTheme> {
  return Object.assign({}, ...themes);
}
