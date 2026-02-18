import {
  ChangeDetectionStrategy,
  Component,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { CdkDialogContainer } from '@angular/cdk/dialog';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { GlintDialogConfig, GLINT_DIALOG_CONFIG } from './dialog.config';
import { GlintDialogRef } from './dialog-ref';

/**
 * Internal dialog container that wraps dialog content.
 *
 * Extends CDK's `CdkDialogContainer` which provides:
 * - Focus trap management
 * - ARIA attributes (role, aria-modal, aria-label, etc.)
 * - Portal outlet for content attachment
 * - Focus restoration on close
 *
 * We add our own header/close-button UI and styling on top.
 */
@Component({
  selector: 'glint-dialog-container',
  standalone: true,
  imports: [CdkPortalOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': 'glint-dialog-container',
  },
  styles: `
    .glint-dialog-container {
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

    .glint-dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-block: var(--glint-spacing-md);
      padding-inline: var(--glint-spacing-lg);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .glint-dialog-title {
      font-weight: 600;
      font-size: 1.125em;
      margin: 0;
    }

    .glint-dialog-close {
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
    .glint-dialog-close:hover {
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
    }
    .glint-dialog-close:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .glint-dialog-body {
      padding: var(--glint-spacing-lg);
    }
  `,
  template: `
    @if (glintConfig.header) {
      <div class="glint-dialog-header">
        <h2 class="glint-dialog-title">{{ glintConfig.header }}</h2>
        @if (!glintConfig.disableClose) {
          <button
            class="glint-dialog-close"
            type="button"
            aria-label="Close dialog"
            (click)="glintDialogRef.close()"
          >&#10005;</button>
        }
      </div>
    }
    <div class="glint-dialog-body">
      <ng-template cdkPortalOutlet />
    </div>
  `,
})
export class GlintDialogContainerComponent extends CdkDialogContainer {
  protected readonly glintConfig = inject<GlintDialogConfig>(GLINT_DIALOG_CONFIG);
  protected readonly glintDialogRef = inject(GlintDialogRef);
}
