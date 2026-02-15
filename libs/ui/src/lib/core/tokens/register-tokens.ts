import {
  BEHAVIORAL_KEYS,
  DEFAULT_ZONE_THEME,
  THEME_TO_CSS_MAP,
  TOKEN_SYNTAX_MAP,
} from './zone-theme.model';

let registered = false;

/**
 * Registers all @glint/ui CSS custom properties via `CSS.registerProperty()`.
 *
 * This enables:
 * - CSS transitions between theme values (colors animate smoothly)
 * - `color-mix()` with `var(--glint-color-*)` tokens
 * - Type-safe CSS custom properties with `syntax` declarations
 * - Global defaults via `initialValue` (fallback when no zone is present)
 *
 * Called once by `provideGlintUI()` or auto-invoked on first StyleZone render.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function registerGlintTokens(): void {
  if (registered) return;
  if (typeof CSS === 'undefined' || !('registerProperty' in CSS)) return;

  const defaults = DEFAULT_ZONE_THEME as unknown as Record<string, string>;

  for (const [key, cssVar] of Object.entries(THEME_TO_CSS_MAP)) {
    if (BEHAVIORAL_KEYS.has(key)) continue;

    const syntax = TOKEN_SYNTAX_MAP[key] ?? '*';
    const initialValue = defaults[key];

    try {
      CSS.registerProperty({
        name: cssVar,
        syntax,
        inherits: true,
        initialValue,
      });
    } catch {
      // Property already registered or invalid — skip silently
    }
  }

  registered = true;
}
