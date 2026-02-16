import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
} from '@angular/core';

/**
 * Progress bar with determinate and indeterminate modes.
 *
 * @example
 * ```html
 * <glint-progress-bar [value]="75" />
 * <glint-progress-bar mode="indeterminate" />
 * ```
 */
@Component({
  selector: 'glint-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'progressbar',
    '[attr.aria-valuenow]': 'mode() === "determinate" ? value() : null',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.data-mode]': 'mode()',
    '[attr.data-severity]': 'severity()',
  },
  styles: `
    :host {
      display: block;
      block-size: 0.375rem;
      border-radius: var(--glint-border-radius);
      background: color-mix(in oklch, var(--glint-color-border), transparent 40%);
      overflow: hidden;
    }

    .bar {
      block-size: 100%;
      border-radius: inherit;
      transition: inline-size var(--glint-duration-normal) var(--glint-easing);
    }

    :host([data-severity="primary"]) .bar { background: var(--glint-color-primary); }
    :host([data-severity="success"]) .bar { background: var(--glint-color-success); }
    :host([data-severity="info"]) .bar { background: var(--glint-color-info); }
    :host([data-severity="warning"]) .bar { background: var(--glint-color-warning); }
    :host([data-severity="danger"]) .bar { background: var(--glint-color-error); }

    :host([data-mode="indeterminate"]) .bar {
      inline-size: 40% !important;
      animation: indeterminate 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
    }

    @keyframes indeterminate {
      0% { translate: -100% 0; }
      100% { translate: 250% 0; }
    }
  `,
  template: `
    <div class="bar" [style.inline-size]="barWidth()"></div>
  `,
})
export class GlintProgressBarComponent {
  /** Current value (0–100) */
  value = input(0);
  /** Mode: determinate shows value, indeterminate shows animation */
  mode = input<'determinate' | 'indeterminate'>('determinate');
  /** Color severity */
  severity = input<'primary' | 'success' | 'info' | 'warning' | 'danger'>('primary');

  protected barWidth = computed(() =>
    this.mode() === 'determinate' ? `${Math.max(0, Math.min(100, this.value()))}%` : ''
  );
}
