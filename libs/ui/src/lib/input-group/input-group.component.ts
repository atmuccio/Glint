import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  ViewEncapsulation,
} from '@angular/core';

/**
 * Addon directive for InputGroup — renders as a labeled prefix/suffix cell.
 *
 * @example
 * ```html
 * <glint-input-group>
 *   <span glintInputGroupAddon>$</span>
 *   <input glintInput />
 *   <span glintInputGroupAddon>.00</span>
 * </glint-input-group>
 * ```
 */
@Directive({
  selector: '[glintInputGroupAddon]',
  standalone: true,
  host: {
    class: 'glint-input-group-addon',
  },
})
export class GlintInputGroupAddonDirective {}

/**
 * Flex wrapper that joins prefix + input + suffix elements with shared border-radius.
 *
 * Uses `ViewEncapsulation.None` so child border-radius rules apply across
 * projected content. All selectors are scoped under `.glint-input-group`.
 *
 * @example
 * ```html
 * <glint-input-group>
 *   <span glintInputGroupAddon>https://</span>
 *   <input glintInput placeholder="example.com" />
 * </glint-input-group>
 * ```
 */
@Component({
  selector: 'glint-input-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'glint-input-group',
  },
  styles: `
    .glint-input-group {
      display: inline-flex;
      align-items: stretch;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .glint-input-group > *:not(:first-child):not(:last-child) {
      border-radius: 0;
    }

    .glint-input-group > *:first-child {
      border-start-end-radius: 0;
      border-end-end-radius: 0;
    }

    .glint-input-group > *:last-child {
      border-start-start-radius: 0;
      border-end-start-radius: 0;
    }

    .glint-input-group > *:not(:first-child) {
      margin-inline-start: -1px;
    }

    .glint-input-group-addon {
      display: flex;
      align-items: center;
      padding-inline: var(--glint-spacing-sm);
      background: var(--glint-color-surface-variant);
      border: 1px solid var(--glint-color-border);
      color: var(--glint-color-text-muted);
      white-space: nowrap;
    }

    .glint-input-group > .glint-input-group-addon:first-child {
      border-start-start-radius: var(--glint-border-radius);
      border-end-start-radius: var(--glint-border-radius);
    }

    .glint-input-group > .glint-input-group-addon:last-child {
      border-start-end-radius: var(--glint-border-radius);
      border-end-end-radius: var(--glint-border-radius);
    }
  `,
  template: `<ng-content />`,
})
export class GlintInputGroupComponent {}
