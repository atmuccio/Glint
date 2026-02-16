import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { CdkTrapFocus } from '@angular/cdk/a11y';
import { GlintDialogConfig, GLINT_DIALOG_CONFIG } from './dialog.config';
import { GlintDialogRef } from './dialog-ref';

/**
 * Internal dialog container that wraps dialog content.
 * Provides focus trap, role="dialog", aria-modal, and optional header with close button.
 */
@Component({
  selector: 'glint-dialog-container',
  standalone: true,
  imports: [CdkTrapFocus],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'dialog',
    'aria-modal': 'true',
  },
  styles: `
    :host {
      display: block;
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
      max-block-size: 90vh;
      overflow: auto;
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing);
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-block: var(--glint-spacing-md);
      padding-inline: var(--glint-spacing-lg);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .dialog-title {
      font-weight: 600;
      font-size: 1.125em;
      margin: 0;
    }

    .dialog-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2rem;
      block-size: 2rem;
      border: none;
      border-radius: var(--glint-border-radius);
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        color var(--glint-duration-fast) var(--glint-easing);
    }
    .dialog-close:hover {
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
    }
    .dialog-close:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .dialog-body {
      padding: var(--glint-spacing-lg);
    }
  `,
  template: `
    <div cdkTrapFocus [cdkTrapFocusAutoCapture]="true">
      @if (config.header) {
        <div class="dialog-header">
          <h2 class="dialog-title">{{ config.header }}</h2>
          @if (!config.disableClose) {
            <button
              class="dialog-close"
              type="button"
              aria-label="Close dialog"
              (click)="dialogRef.close()"
            >&#10005;</button>
          }
        </div>
      }
      <div class="dialog-body">
        <ng-template #outlet />
      </div>
    </div>
  `,
})
export class GlintDialogContainerComponent {
  @ViewChild('outlet', { read: ViewContainerRef, static: true })
  outlet!: ViewContainerRef;

  protected readonly config = inject<GlintDialogConfig>(GLINT_DIALOG_CONFIG);
  protected readonly dialogRef = inject(GlintDialogRef);
}
