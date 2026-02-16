import { InjectionToken } from '@angular/core';

/**
 * Position options for the dialog on screen.
 */
export type GlintDialogPosition =
  | 'center'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right';

/**
 * Configuration for opening a dialog.
 */
export interface GlintDialogConfig<D = unknown> {
  /** Data to pass to the dialog component */
  data?: D;
  /** Optional header title (shows a header bar with close button) */
  header?: string;
  /** Dialog position on screen */
  position?: GlintDialogPosition;
  /** Dialog width */
  width?: string;
  /** Dialog height */
  height?: string;
  /** Maximum dialog width */
  maxWidth?: string;
  /** Maximum dialog height */
  maxHeight?: string;
  /** Show backdrop */
  hasBackdrop?: boolean;
  /** Prevent close on backdrop click or Escape */
  disableClose?: boolean;
  /** Aria label for the dialog container */
  ariaLabel?: string;
}

/**
 * Injection token for accessing data passed to a dialog.
 *
 * @example
 * ```typescript
 * const data = inject(GLINT_DIALOG_DATA);
 * ```
 */
export const GLINT_DIALOG_DATA = new InjectionToken<unknown>('GLINT_DIALOG_DATA');

/**
 * Injection token for accessing internal dialog config inside the container.
 */
export const GLINT_DIALOG_CONFIG = new InjectionToken<GlintDialogConfig>('GLINT_DIALOG_CONFIG');
