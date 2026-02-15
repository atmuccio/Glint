import { InjectionToken, Signal, signal } from '@angular/core';
import { DEFAULT_ZONE_THEME, ZoneTheme } from './zone-theme.model';

/**
 * Injection token providing the current zone's theme as a reactive signal.
 *
 * Components inject this to access behavioral theme properties (e.g., defaultVariant).
 * Visual properties are accessed via CSS custom properties in component styles.
 *
 * The root-level factory provides a signal wrapping DEFAULT_ZONE_THEME,
 * ensuring components work correctly even outside any `<glint-style-zone>`.
 *
 * @example
 * ```typescript
 * private zone = inject(ZONE_THEME);
 * private defaultVariant = computed(() => this.zone().defaultVariant);
 * ```
 */
export const ZONE_THEME = new InjectionToken<Signal<ZoneTheme>>('ZONE_THEME', {
  providedIn: 'root',
  factory: () => signal(DEFAULT_ZONE_THEME).asReadonly(),
});
