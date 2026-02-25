import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';

/**
 * Top header bar within a shell layout.
 * Content is projected by the consuming application.
 *
 * @example
 * ```html
 * <glint-shell-header>
 *   <span>App Title</span>
 *   <glint-avatar [label]="'JD'" size="sm" />
 * </glint-shell-header>
 * ```
 */
@Component({
  selector: 'glint-shell-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'banner',
    '[style.block-size]': 'height()',
  },
  styles: `
    :host {
      grid-column: 2;
      grid-row: 1;
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      background: var(--glint-color-surface);
      border-block-end: 1px solid var(--glint-color-border);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing);
    }
  `,
  template: `<ng-content />`,
})
export class GlintShellHeaderComponent {
  /** Header height */
  height = input('56px');
}
