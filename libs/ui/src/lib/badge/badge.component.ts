import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Badge component for displaying small status indicators or counts.
 *
 * @example
 * ```html
 * <glint-badge>4</glint-badge>
 * <glint-badge severity="danger">99+</glint-badge>
 * <glint-badge severity="success" size="lg">New</glint-badge>
 * ```
 */
@Component({
  selector: 'glint-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-severity]': 'severity()',
    '[attr.data-size]': 'size()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--glint-font-family);
      font-weight: 600;
      line-height: 1;
      white-space: nowrap;
      border-radius: 9999px;
      padding-block: 0.125rem;
      padding-inline: 0.5rem;
      font-size: 0.75rem;
      min-inline-size: 1.25rem;
      block-size: 1.25rem;
    }

    :host([data-size="lg"]) {
      font-size: 0.875rem;
      padding-block: 0.25rem;
      padding-inline: 0.625rem;
      min-inline-size: 1.5rem;
      block-size: 1.5rem;
    }

    :host([data-severity="primary"]) {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
    }
    :host([data-severity="secondary"]) {
      background: var(--glint-color-secondary);
      color: var(--glint-color-secondary-contrast);
    }
    :host([data-severity="success"]) {
      background: var(--glint-color-success);
      color: white;
    }
    :host([data-severity="info"]) {
      background: var(--glint-color-info);
      color: white;
    }
    :host([data-severity="warning"]) {
      background: var(--glint-color-warning);
      color: white;
    }
    :host([data-severity="danger"]) {
      background: var(--glint-color-error);
      color: white;
    }
  `,
  template: `<ng-content />`,
})
export class GlintBadgeComponent {
  /** Color severity */
  severity = input<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'>('primary');
  /** Size */
  size = input<'sm' | 'lg'>('sm');
}
