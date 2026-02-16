import { inject, Injectable, Injector } from '@angular/core';
import { injectGlintDialog } from '../dialog/dialog.service';
import { GlintConfirmDialogComponent } from './confirm-dialog.component';

/** Configuration for a confirm dialog */
export interface GlintConfirmConfig {
  /** Header text */
  header?: string;
  /** Message body */
  message: string;
  /** Severity icon */
  severity?: 'info' | 'warning' | 'danger';
  /** Accept button label */
  acceptLabel?: string;
  /** Reject button label */
  rejectLabel?: string;
}

/**
 * Service for showing confirm dialogs. Returns a promise that resolves to true/false.
 *
 * @example
 * ```typescript
 * const confirm = inject(GlintConfirmDialogService);
 * const ok = await confirm.confirm({
 *   header: 'Delete?',
 *   message: 'This action cannot be undone.',
 *   severity: 'danger',
 * });
 * if (ok) { deleteItem(); }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class GlintConfirmDialogService {
  private dialog = injectGlintDialog();

  confirm(config: GlintConfirmConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      const ref = this.dialog.open(GlintConfirmDialogComponent, {
        data: config,
        header: config.header ?? 'Confirm',
        disableClose: true,
      });

      ref.afterClosed$.subscribe((result: unknown) => {
        resolve(result === true);
      });
    });
  }
}
