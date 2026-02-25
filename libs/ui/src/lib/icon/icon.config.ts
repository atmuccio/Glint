import { InjectionToken, Provider } from '@angular/core';

/** Global defaults for `<glint-icon>` instances. */
export interface GlintIconConfig {
  /** Default CSS size value (e.g. `'1.25rem'`). */
  size?: string;
  /** Default stroke width for stroke-based icons. */
  strokeWidth?: string | number;
}

/**
 * Optional global icon configuration token.
 *
 * Provide via `provideGlintIconConfig()` to set defaults for all
 * `<glint-icon>` instances that don't have explicit size/strokeWidth inputs.
 */
export const GLINT_ICON_CONFIG = new InjectionToken<GlintIconConfig>(
  'GLINT_ICON_CONFIG',
);

/**
 * Provide global icon configuration.
 *
 * @example
 * ```typescript
 * provideGlintIconConfig({ size: '1.25rem', strokeWidth: 1.5 })
 * ```
 */
export function provideGlintIconConfig(config: GlintIconConfig): Provider {
  return { provide: GLINT_ICON_CONFIG, useValue: config };
}
