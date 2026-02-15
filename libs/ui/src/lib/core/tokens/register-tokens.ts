import {
  BEHAVIORAL_KEYS,
  DEFAULT_ZONE_THEME,
  THEME_TO_CSS_MAP,
  TOKEN_SYNTAX_MAP,
} from './zone-theme.model';

let registered = false;

/**
 * px equivalents for @property initialValue registration.
 *
 * CSS.registerProperty() requires initialValue to be "computationally independent",
 * meaning rem/em/%/vw units are rejected. These px values correspond to the
 * DEFAULT_ZONE_THEME values at the standard 16px root font-size.
 *
 * The palette values (rem) and setProperty() calls remain unchanged —
 * only the initialValue passed to CSS.registerProperty() uses px.
 */
const REGISTRATION_OVERRIDES: Record<string, string> = {
  spacingXs: '4px',
  spacingSm: '8px',
  spacingMd: '12px',
  spacingLg: '16px',
  spacingXl: '24px',
  borderRadius: '6px',
  fontSize: '16px',
};

/**
 * Registers all @glint/ui design tokens globally.
 *
 * Two-phase setup:
 * 1. Sets default CSS custom property values on `:root` — this is what makes
 *    components look correct out of the box without any `<glint-style-zone>`.
 * 2. Registers `@property` definitions (progressive enhancement) for CSS
 *    transitions, `color-mix()`, and type-safe custom properties.
 *
 * Called once by `provideGlintUI()` or auto-invoked on first StyleZone render.
 * Safe to call multiple times — subsequent calls are no-ops.
 */
export function registerGlintTokens(): void {
  if (registered) return;

  const defaults = DEFAULT_ZONE_THEME as unknown as Record<string, string>;

  // 1. Set default CSS custom property values on :root.
  //    Uses the actual palette values (rem-based), so they scale with root font-size.
  if (typeof document !== 'undefined') {
    const root = document.documentElement;
    for (const [key, cssVar] of Object.entries(THEME_TO_CSS_MAP)) {
      if (BEHAVIORAL_KEYS.has(key)) continue;
      const value = defaults[key];
      if (value !== undefined) {
        root.style.setProperty(cssVar, value);
      }
    }
  }

  // 2. Register @property definitions (progressive enhancement).
  //    Enables CSS transitions, color-mix(), and type-safe properties.
  //    Uses px overrides for rem-based tokens (CSS.registerProperty requires
  //    computationally independent initialValue).
  if (typeof CSS !== 'undefined' && 'registerProperty' in CSS) {
    for (const [key, cssVar] of Object.entries(THEME_TO_CSS_MAP)) {
      if (BEHAVIORAL_KEYS.has(key)) continue;
      const syntax = TOKEN_SYNTAX_MAP[key] ?? '*';
      const initialValue = REGISTRATION_OVERRIDES[key] ?? defaults[key];
      try {
        CSS.registerProperty({ name: cssVar, syntax, inherits: true, initialValue });
      } catch { /* already registered or invalid */ }
    }
  }

  registered = true;
}
