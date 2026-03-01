import { CSSShadow } from '../types/branded';

/**
 * Box shadow scale for elevation.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ shadow: GlintShadow.Md }">
 * ```
 */
export const GlintShadow = {
  /** No shadow */
  None: 'none' as CSSShadow,
  /** Subtle shadow */
  Sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)' as CSSShadow,
  /** Default shadow */
  Md: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)' as CSSShadow,
  /** Medium shadow */
  Lg: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' as CSSShadow,
  /** Large shadow */
  Xl: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' as CSSShadow,
} as const;
