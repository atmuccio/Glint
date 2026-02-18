import {
  ChangeDetectionStrategy,
  Component,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Wrapper component that animates a label above an input when focused or filled.
 *
 * Uses `ViewEncapsulation.None` with class-scoped selectors so the CSS
 * `:has()` rules can reach projected `<label>` and `<input>` elements.
 *
 * @example
 * ```html
 * <glint-float-label>
 *   <input type="text" placeholder=" " />
 *   <label>Username</label>
 * </glint-float-label>
 * ```
 */
@Component({
  selector: 'glint-float-label',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'glint-float-label',
  },
  styles: `
    .glint-float-label {
      display: block;
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .glint-float-label-wrapper {
      position: relative;
    }

    .glint-float-label label {
      position: absolute;
      inset-block-start: 50%;
      inset-inline-start: var(--glint-spacing-sm);
      transform: translateY(-50%);
      transition:
        inset-block-start var(--glint-duration-fast) var(--glint-easing),
        font-size var(--glint-duration-fast) var(--glint-easing),
        color var(--glint-duration-fast) var(--glint-easing);
      color: var(--glint-color-text-muted);
      pointer-events: none;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      background: var(--glint-color-surface);
      padding-inline: 2px;
      line-height: 1;
    }

    /* Float up when input is focused */
    .glint-float-label:has(input:focus) label,
    .glint-float-label:has(textarea:focus) label,
    /* Float up when input has a value (requires placeholder=" ") */
    .glint-float-label:has(input:not(:placeholder-shown)) label,
    .glint-float-label:has(textarea:not(:placeholder-shown)) label {
      inset-block-start: 0;
      font-size: 0.75em;
      color: var(--glint-color-primary);
    }
  `,
  template: `
    <div class="glint-float-label-wrapper">
      <ng-content />
    </div>
  `,
})
export class GlintFloatLabelComponent {}
