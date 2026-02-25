import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * Main content area within a shell layout. Scrollable container
 * that typically houses a `<router-outlet>`.
 *
 * @example
 * ```html
 * <glint-shell-content>
 *   <router-outlet />
 * </glint-shell-content>
 * ```
 */
@Component({
  selector: 'glint-shell-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'main',
  },
  styles: `
    :host {
      grid-column: 2;
      grid-row: 2;
      overflow-y: auto;
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing);
    }
  `,
  template: `<ng-content />`,
})
export class GlintShellContentComponent {}
