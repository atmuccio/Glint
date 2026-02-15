import { InjectionToken } from '@angular/core';

/**
 * Configuration for opening a dialog.
 */
export interface GlintDialogConfig<D = unknown> {
  /** Data to pass to the dialog component */
  data?: D;
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
