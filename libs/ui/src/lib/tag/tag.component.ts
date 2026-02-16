import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

/**
 * Tag component for displaying labels with optional icon and remove button.
 *
 * @example
 * ```html
 * <glint-tag severity="info">Feature</glint-tag>
 * <glint-tag severity="success" [removable]="true" (removed)="onRemove()">Active</glint-tag>
 * ```
 */
@Component({
  selector: 'glint-tag',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-severity]': 'severity()',
    '[attr.data-rounded]': 'rounded() || null',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      font-family: var(--glint-font-family);
      font-size: 0.875rem;
      font-weight: 500;
      line-height: 1.25;
      padding-block: 0.25rem;
      padding-inline: 0.625rem;
      border-radius: var(--glint-border-radius);
      white-space: nowrap;
    }

    :host([data-rounded]) {
      border-radius: 9999px;
    }

    :host([data-severity="primary"]) {
      background: color-mix(in oklch, var(--glint-color-primary), white 85%);
      color: var(--glint-color-primary);
    }
    :host([data-severity="secondary"]) {
      background: var(--glint-color-secondary);
      color: var(--glint-color-secondary-contrast);
    }
    :host([data-severity="success"]) {
      background: color-mix(in oklch, var(--glint-color-success), white 85%);
      color: var(--glint-color-success);
    }
    :host([data-severity="info"]) {
      background: color-mix(in oklch, var(--glint-color-info), white 85%);
      color: var(--glint-color-info);
    }
    :host([data-severity="warning"]) {
      background: color-mix(in oklch, var(--glint-color-warning), white 85%);
      color: var(--glint-color-warning);
    }
    :host([data-severity="danger"]) {
      background: color-mix(in oklch, var(--glint-color-error), white 85%);
      color: var(--glint-color-error);
    }

    .remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1rem;
      block-size: 1rem;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 0.75rem;
      line-height: 1;
      opacity: 0.7;
      transition: opacity var(--glint-duration-fast) var(--glint-easing);
    }
    .remove:hover {
      opacity: 1;
    }
    .remove:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }
  `,
  template: `
    <ng-content select="[glintTagIcon]" />
    <ng-content />
    @if (removable()) {
      <button
        class="remove"
        type="button"
        aria-label="Remove"
        (click)="removed.emit()"
      >&#10005;</button>
    }
  `,
})
export class GlintTagComponent {
  /** Color severity */
  severity = input<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger'>('primary');
  /** Pill shape */
  rounded = input(false);
  /** Show remove button */
  removable = input(false);
  /** Emitted when remove button is clicked */
  removed = output<void>();
}
