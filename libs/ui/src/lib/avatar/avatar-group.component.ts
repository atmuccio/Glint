import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';

/**
 * Avatar group that stacks avatars with overlap.
 *
 * @example
 * ```html
 * <glint-avatar-group>
 *   <glint-avatar label="Alice" />
 *   <glint-avatar label="Bob" />
 *   <glint-avatar label="+3" />
 * </glint-avatar-group>
 * ```
 */
@Component({
  selector: 'glint-avatar-group',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: inline-flex;
      flex-direction: row-reverse;
    }

    :host ::ng-deep glint-avatar {
      margin-inline-start: -0.75rem;
      border: 2px solid var(--glint-color-surface);
    }

    :host ::ng-deep glint-avatar:last-child {
      margin-inline-start: 0;
    }
  `,
  template: `<ng-content />`,
})
export class GlintAvatarGroupComponent {}
