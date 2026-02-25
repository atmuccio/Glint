import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { GLINT_DIALOG_DATA } from '../dialog/dialog.config';
import { GlintDialogRef } from '../dialog/dialog-ref';
import { GlintIconComponent } from '../icon/icon.component';
import type { GlintConfirmConfig } from './confirm-dialog.service';

/**
 * Internal confirm dialog content component.
 */
@Component({
  selector: 'glint-confirm-dialog',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      min-inline-size: 20rem;
    }

    .icon {
      font-size: 1.5rem;
      margin-block-end: var(--glint-spacing-sm);
    }
    .icon.info { color: var(--glint-color-info); }
    .icon.warning { color: var(--glint-color-warning); }
    .icon.danger { color: var(--glint-color-error); }

    .message {
      margin-block-end: var(--glint-spacing-lg);
      line-height: 1.5;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--glint-spacing-sm);
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-md);
      font: inherit;
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .btn-reject {
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
    }
    .btn-reject:hover {
      background: var(--glint-color-surface-variant);
    }

    .btn-accept {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
    }
    .btn-accept:hover {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
    }

    .btn-accept.danger {
      background: var(--glint-color-error);
      border-color: var(--glint-color-error);
    }
    .btn-accept.danger:hover {
      background: color-mix(in oklch, var(--glint-color-error), black 10%);
    }

    .btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }
  `,
  template: `
    @if (config.severity) {
      <div class="icon" [class]="config.severity">
        <glint-icon [name]="severityIcon()" />
      </div>
    }
    <div class="message">{{ config.message }}</div>
    <div class="actions">
      <button class="btn btn-reject" (click)="ref.close(false)">{{ config.rejectLabel ?? 'Cancel' }}</button>
      <button class="btn btn-accept" [class.danger]="config.severity === 'danger'" (click)="ref.close(true)">{{ config.acceptLabel ?? 'Confirm' }}</button>
    </div>
  `,
})
export class GlintConfirmDialogComponent {
  protected config = inject<GlintConfirmConfig>(GLINT_DIALOG_DATA);
  protected ref = inject(GlintDialogRef);

  protected severityIcon = computed(() => {
    switch (this.config.severity) {
      case 'info': return 'info';
      case 'warning': return 'triangleAlert';
      case 'danger': return 'circleX';
      default: return '';
    }
  });
}
