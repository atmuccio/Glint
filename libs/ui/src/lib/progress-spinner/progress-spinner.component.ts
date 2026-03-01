import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Circular loading spinner.
 *
 * @example
 * ```html
 * <glint-progress-spinner />
 * <glint-progress-spinner size="3rem" strokeWidth="4" />
 * ```
 */
@Component({
  selector: 'glint-progress-spinner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'status',
    'aria-label': 'Loading',
    '[style.inline-size]': 'size()',
    '[style.block-size]': 'size()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    svg {
      animation: spin 1.2s linear infinite;
      inline-size: 100%;
      block-size: 100%;
    }

    circle {
      stroke: var(--glint-color-primary);
      fill: none;
      stroke-linecap: round;
      animation: dash 1.5s ease-in-out infinite;
    }

    @keyframes spin {
      100% { rotate: 360deg; }
    }

    @keyframes dash {
      0% {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
      }
      50% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -35;
      }
      100% {
        stroke-dasharray: 90, 150;
        stroke-dashoffset: -124;
      }
    }
  `,
  template: `
    <svg viewBox="0 0 50 50">
      <circle cx="25" cy="25" r="20" [attr.stroke-width]="strokeWidth()" />
    </svg>
  `,
})
export class GlintProgressSpinnerComponent {
  /** Spinner size (CSS length) */
  size = input('2.5rem');
  /** Stroke width */
  strokeWidth = input('3');
}
