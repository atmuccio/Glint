import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Skeleton loading placeholder with shimmer animation.
 *
 * @example
 * ```html
 * <glint-skeleton width="100%" height="1.5rem" />
 * <glint-skeleton shape="circle" size="3rem" />
 * ```
 */
@Component({
  selector: 'glint-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-shape]': 'shape()',
    '[style.inline-size]': 'shape() === "circle" ? size() : width()',
    '[style.block-size]': 'shape() === "circle" ? size() : height()',
  },
  styles: `
    :host {
      display: block;
      background: color-mix(in oklch, var(--glint-color-border), transparent 30%);
      overflow: hidden;
      position: relative;
    }

    :host([data-shape="rectangle"]) {
      border-radius: var(--glint-border-radius);
    }

    :host([data-shape="rounded"]) {
      border-radius: 9999px;
    }

    :host([data-shape="circle"]) {
      border-radius: 50%;
    }

    :host::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        color-mix(in oklch, var(--glint-color-surface), transparent 50%) 50%,
        transparent 100%
      );
      animation: shimmer 1.5s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { translate: -100% 0; }
      100% { translate: 100% 0; }
    }
  `,
  template: '',
})
export class GlintSkeletonComponent {
  /** Shape variant */
  shape = input<'rectangle' | 'rounded' | 'circle'>('rectangle');
  /** Width (for rectangle/rounded shapes) */
  width = input('100%');
  /** Height (for rectangle/rounded shapes) */
  height = input('1rem');
  /** Size (for circle shape — sets both width and height) */
  size = input('3rem');
}
