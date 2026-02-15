import { TOKEN_SYNTAX_MAP, THEME_TO_CSS_MAP } from '../tokens/zone-theme.model';
import { ZONE_INHERIT } from '../tokens/zone-inherit';

/**
 * Validates a theme value against its expected CSS syntax.
 * Only runs in development mode (behind `ngDevMode` guard).
 *
 * Uses `CSS.supports()` to check if the value is valid for the token's
 * declared syntax, and logs a warning with helpful suggestions if not.
 */
export function validateThemeValue(key: string, value: unknown): void {
  if (typeof ngDevMode === 'undefined' || !ngDevMode) return;
  if (value === ZONE_INHERIT) return;
  if (typeof value !== 'string') return;

  const cssVar = THEME_TO_CSS_MAP[key];
  if (!cssVar) return;

  const syntax = TOKEN_SYNTAX_MAP[key];
  if (!syntax || syntax === '*') return;

  // Map syntax to a CSS property we can validate against
  let testProperty: string;
  switch (syntax) {
    case '<color>':
      testProperty = 'color';
      break;
    case '<length>':
      testProperty = 'width';
      break;
    default:
      return; // Can't validate this syntax
  }

  if (typeof CSS !== 'undefined' && !CSS.supports(testProperty, value)) {
    console.warn(
      `[@glint/ui] Invalid value for theme token "${key}": "${value}". ` +
      `Expected a valid CSS ${syntax.replace(/[<>]/g, '')} value. ` +
      `Use palette constants (e.g., GlintColor.Blue.S500) for type-safe values.`
    );
  }
}

declare const ngDevMode: boolean | undefined;
