import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';

/**
 * Static inline message for displaying contextual feedback.
 *
 * @example
 * ```html
 * <glint-message severity="success">Operation completed successfully.</glint-message>
 * <glint-message severity="danger" [closable]="true">An error occurred.</glint-message>
 * ```
 */
@Component({
  selector: 'glint-message',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'alert',
    '[attr.data-severity]': 'severity()',
    '[class.closed]': 'closed()',
  },
  styles: `
    :host {
      display: flex;
      align-items: flex-start;
      gap: var(--glint-spacing-sm);
      padding: var(--glint-spacing-md);
      border-radius: var(--glint-border-radius);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      line-height: 1.5;
    }

    :host(.closed) {
      display: none;
    }

    :host([data-severity="success"]) {
      background: color-mix(in oklch, var(--glint-color-success), white 88%);
      color: var(--glint-color-success);
      border: 1px solid color-mix(in oklch, var(--glint-color-success), transparent 70%);
    }
    :host([data-severity="info"]) {
      background: color-mix(in oklch, var(--glint-color-info), white 88%);
      color: var(--glint-color-info);
      border: 1px solid color-mix(in oklch, var(--glint-color-info), transparent 70%);
    }
    :host([data-severity="warning"]) {
      background: color-mix(in oklch, var(--glint-color-warning), white 88%);
      color: var(--glint-color-warning);
      border: 1px solid color-mix(in oklch, var(--glint-color-warning), transparent 70%);
    }
    :host([data-severity="danger"]) {
      background: color-mix(in oklch, var(--glint-color-error), white 88%);
      color: var(--glint-color-error);
      border: 1px solid color-mix(in oklch, var(--glint-color-error), transparent 70%);
    }

    .icon {
      flex-shrink: 0;
      font-size: 1.125rem;
      line-height: 1.5;
    }

    .content {
      flex: 1;
      min-inline-size: 0;
    }

    .close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      padding: 0;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      font-size: 0.875rem;
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
    <span class="icon">{{ severityIcon() }}</span>
    <span class="content"><ng-content /></span>
    @if (closable()) {
      <button class="close" aria-label="Close" (click)="closed.set(true)">&#10005;</button>
    }
  `,
})
export class GlintMessageComponent {
  /** Severity level */
  severity = input<'success' | 'info' | 'warning' | 'danger'>('info');
  /** Whether the message can be dismissed */
  closable = input(false);

  protected closed = signal(false);

  protected severityIcon = computed(() => {
    switch (this.severity()) {
      case 'success': return '\u2713';
      case 'info': return '\u24D8';
      case 'warning': return '\u26A0';
      case 'danger': return '\u2716';
    }
  });
}
