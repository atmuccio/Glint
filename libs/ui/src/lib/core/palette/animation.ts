import { CSSDuration } from '../types/branded';

/**
 * Animation duration presets.
 *
 * @example
 * ```html
 * <glint-style-zone [theme]="{ durationNormal: GlintDuration.Slow }">
 * ```
 */
export const GlintDuration = {
  /** 100ms — micro interactions */
  Fast: '100ms' as CSSDuration,
  /** 200ms — standard transitions */
  Normal: '200ms' as CSSDuration,
  /** 400ms — complex animations */
  Slow: '400ms' as CSSDuration,
} as const;

/**
 * Easing function presets.
 */
export const GlintEasing = {
  /** Standard ease for most transitions */
  Standard: 'cubic-bezier(0.4, 0, 0.2, 1)',
  /** Decelerate — entering elements */
  Decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  /** Accelerate — exiting elements */
  Accelerate: 'cubic-bezier(0.4, 0, 1, 1)',
} as const;
