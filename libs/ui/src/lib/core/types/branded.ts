/**
 * Branded types for compile-time safety of CSS values.
 *
 * These prevent category mistakes — a CSSColor can't be passed where
 * a CSSLength is expected. Palette constants are pre-cast. Raw values
 * require an explicit cast: `'#custom' as CSSColor`.
 */

/** A valid CSS color value (hex, rgb, hsl, oklch, named colors, etc.) */
export type CSSColor = string & { readonly __brand: 'css-color' };

/** A valid CSS length value (px, rem, em, %, etc.) */
export type CSSLength = string & { readonly __brand: 'css-length' };

/** A valid CSS border-radius value */
export type CSSBorderRadius = string & { readonly __brand: 'css-border-radius' };

/** A valid CSS box-shadow value */
export type CSSShadow = string & { readonly __brand: 'css-shadow' };

/** A valid CSS font-family value */
export type CSSFontFamily = string & { readonly __brand: 'css-font-family' };

/** A valid CSS duration value (ms, s) */
export type CSSDuration = string & { readonly __brand: 'css-duration' };
