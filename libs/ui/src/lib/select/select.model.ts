import { InjectionToken } from '@angular/core';

/**
 * Injection token for the parent select component.
 * Used by GlintSelectOptionComponent to communicate with its parent.
 */
export const GLINT_SELECT = new InjectionToken<GlintSelectHost>('GLINT_SELECT');

/**
 * Interface that the parent select component must implement.
 * Consumed by option components via the GLINT_SELECT injection token.
 */
export interface GlintSelectHost {
  /** Whether multi-select mode is enabled */
  multiple(): boolean;
  /** Notify parent that an option was clicked */
  selectOption(value: unknown): void;
  /** Check if a value is currently selected */
  isSelected(value: unknown): boolean;
  /** Get the currently active (keyboard-highlighted) option ID */
  activeOptionId(): string | null;
  /** Get the current search term for filtering */
  searchTerm(): string;
}

/** Default compare function for option values */
export type CompareWithFn = (a: unknown, b: unknown) => boolean;
export const DEFAULT_COMPARE_WITH: CompareWithFn = (a, b) => a === b;
