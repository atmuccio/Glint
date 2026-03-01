import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { GlintIconComponent } from '../icon/icon.component';

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
  imports: [GlintIconComponent],
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
      padding: 0.25rem;
      inline-size: 2rem;
      block-size: 2rem;
      font-size: 0.875rem;
      line-height: 1;
      border-radius: var(--glint-border-radius);
      flex-shrink: 0;
      opacity: 0.6;
      transition: opacity var(--glint-duration-fast) var(--glint-easing),
        background-color var(--glint-duration-fast) var(--glint-easing);
    }
    .close:hover {
      opacity: 1;
      background: color-mix(in oklch, currentColor, transparent 88%);
    }
    .close:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }
  `,
  template: `
    <glint-icon class="icon" [name]="severityIcon()" />
    <span class="content"><ng-content /></span>
    @if (closable()) {
      <button class="close" aria-label="Close" (click)="closed.set(true)"><glint-icon name="x" /></button>
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
      case 'success': return 'circleCheck';
      case 'info': return 'info';
      case 'warning': return 'triangleAlert';
      case 'danger': return 'circleX';
    }
  });
}
