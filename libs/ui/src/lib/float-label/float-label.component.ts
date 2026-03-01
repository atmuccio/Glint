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

    /* ── Style native input/select/textarea to match glint-input ── */
    .glint-float-label input,
    .glint-float-label select,
    .glint-float-label textarea {
      display: block;
      box-sizing: border-box;
      inline-size: 100%;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      outline: none;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    .glint-float-label input:focus,
    .glint-float-label select:focus,
    .glint-float-label textarea:focus {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    .glint-float-label input::placeholder,
    .glint-float-label textarea::placeholder {
      color: var(--glint-color-text-muted);
    }

    /* Don't re-style glint-input's internal input (it handles its own borders) */
    .glint-float-label glint-input input {
      border: none;
      box-shadow: none;
      padding-inline: 0;
    }

    .glint-float-label glint-input input:focus {
      border: none;
      box-shadow: none;
    }

    /* Float up when input is focused */
    .glint-float-label:has(input:focus) label,
    .glint-float-label:has(textarea:focus) label,
    .glint-float-label:has(select:focus) label,
    /* Float up when input has a value (requires placeholder=" ") */
    .glint-float-label:has(input:not(:placeholder-shown)) label,
    .glint-float-label:has(textarea:not(:placeholder-shown)) label,
    /* Float up when select has a selected value */
    .glint-float-label:has(select:not([data-empty])) label {
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
