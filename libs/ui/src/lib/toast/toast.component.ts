import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { GlintToastService } from './toast.service';

/**
 * Toast container component. Place once in the app root.
 *
 * @example
 * ```html
 * <glint-toast />
 * ```
 */
@Component({
  selector: 'glint-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-position]': 'position()',
    'aria-live': 'polite',
    'aria-atomic': 'false',
  },
  styles: `
    :host {
      position: fixed;
      z-index: 1080; /* GlintZIndex.Toast */
      display: flex;
      flex-direction: column;
      gap: var(--glint-spacing-sm);
      max-inline-size: 24rem;
      pointer-events: none;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    :host([data-position="top-right"]) {
      inset-block-start: var(--glint-spacing-lg);
      inset-inline-end: var(--glint-spacing-lg);
    }
    :host([data-position="top-left"]) {
      inset-block-start: var(--glint-spacing-lg);
      inset-inline-start: var(--glint-spacing-lg);
    }
    :host([data-position="top-center"]) {
      inset-block-start: var(--glint-spacing-lg);
      inset-inline-start: 50%;
      translate: -50% 0;
    }
    :host([data-position="bottom-right"]) {
      inset-block-end: var(--glint-spacing-lg);
      inset-inline-end: var(--glint-spacing-lg);
    }
    :host([data-position="bottom-left"]) {
      inset-block-end: var(--glint-spacing-lg);
      inset-inline-start: var(--glint-spacing-lg);
    }
    :host([data-position="bottom-center"]) {
      inset-block-end: var(--glint-spacing-lg);
      inset-inline-start: 50%;
      translate: -50% 0;
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--glint-spacing-sm);
      padding: var(--glint-spacing-md);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      box-shadow: var(--glint-shadow);
      pointer-events: auto;
    }

    .toast[data-severity="success"] {
      border-inline-start: 4px solid var(--glint-color-success);
    }
    .toast[data-severity="info"] {
      border-inline-start: 4px solid var(--glint-color-info);
    }
    .toast[data-severity="warning"] {
      border-inline-start: 4px solid var(--glint-color-warning);
    }
    .toast[data-severity="danger"] {
      border-inline-start: 4px solid var(--glint-color-error);
    }

    .icon {
      flex-shrink: 0;
      font-size: 1.25rem;
      line-height: 1;
    }
    .toast[data-severity="success"] .icon { color: var(--glint-color-success); }
    .toast[data-severity="info"] .icon { color: var(--glint-color-info); }
    .toast[data-severity="warning"] .icon { color: var(--glint-color-warning); }
    .toast[data-severity="danger"] .icon { color: var(--glint-color-error); }

    .content {
      flex: 1;
      min-inline-size: 0;
    }

    .summary {
      font-weight: 600;
      color: var(--glint-color-text);
    }

    .detail {
      margin-block-start: 0.25rem;
      color: var(--glint-color-text-muted);
      font-size: 0.875em;
    }

    .close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      padding: 0;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      font-size: 1rem;
      line-height: 1;
      flex-shrink: 0;
      opacity: 0.6;
      transition: opacity var(--glint-duration-fast) var(--glint-easing);
    }
    .close:hover { opacity: 1; }
    .close:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }
  `,
  template: `
    @for (msg of messages(); track msg.id) {
      <div class="toast" [attr.data-severity]="msg.severity" role="alert">
        <span class="icon">{{ severityIcon(msg.severity) }}</span>
        <div class="content">
          <div class="summary">{{ msg.summary }}</div>
          @if (msg.detail) {
            <div class="detail">{{ msg.detail }}</div>
          }
        </div>
        @if (msg.closable !== false) {
          <button class="close" aria-label="Close" (click)="dismiss(msg.id)">&#10005;</button>
        }
      </div>
    }
  `,
})
export class GlintToastComponent {
  private readonly toastService = inject(GlintToastService);

  protected messages = this.toastService.messages;
  protected position = this.toastService.position;

  protected severityIcon(severity: string): string {
    switch (severity) {
      case 'success': return '\u2713';
      case 'info': return '\u24D8';
      case 'warning': return '\u26A0';
      case 'danger': return '\u2716';
      default: return '';
    }
  }

  protected dismiss(id: number): void {
    this.toastService.dismiss(id);
  }
}
