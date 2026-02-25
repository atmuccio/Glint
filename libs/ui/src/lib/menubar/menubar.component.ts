import {
  ChangeDetectionStrategy,
  Component,
  input,
} from '@angular/core';
import { CdkMenu, CdkMenuBar, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import type { GlintMenuItem } from '../menu/menu-item.model';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Horizontal menu bar with dropdown submenus, similar to a desktop application menu bar.
 * Uses Angular CDK Menu primitives (CdkMenuBar + CdkMenu + CdkMenuItem + CdkMenuTrigger)
 * for keyboard navigation, focus management, ARIA roles, and submenu coordination.
 *
 * @example
 * ```html
 * <glint-menubar [items]="menuItems" />
 * ```
 */
@Component({
  selector: 'glint-menubar',
  standalone: true,
  imports: [CdkMenu, CdkMenuBar, CdkMenuItem, CdkMenuTrigger, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .menubar {
      display: flex;
      align-items: center;
      background: var(--glint-color-surface);
      border-block-end: 1px solid var(--glint-color-border);
      padding-block: 0;
      padding-inline: 0;
      margin: 0;
    }

    .menubar-item {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      font: inherit;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      cursor: pointer;
      text-align: start;
      transition: background-color var(--glint-duration-fast) var(--glint-easing),
                  color var(--glint-duration-fast) var(--glint-easing);
    }

    .menubar-item:hover:not([aria-disabled="true"]) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .menubar-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .menubar-item[aria-disabled="true"] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .caret {
      font-size: 0.75em;
      margin-inline-start: var(--glint-spacing-xs);
    }

    .dropdown-menu {
      display: block;
      min-inline-size: 12rem;
      padding-block: var(--glint-spacing-xs);
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: var(--glint-shadow);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      inline-size: 100%;
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      font: inherit;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      cursor: pointer;
      text-align: start;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .dropdown-item:hover:not([aria-disabled="true"]) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .dropdown-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .dropdown-item[aria-disabled="true"] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .separator {
      block-size: 1px;
      background: var(--glint-color-border);
      margin-block: var(--glint-spacing-xs);
    }
  `,
  template: `
    <div class="menubar" cdkMenuBar>
      @for (item of items(); track item.label) {
        @if (item.items?.length) {
          <button
            class="menubar-item"
            cdkMenuItem
            [cdkMenuItemDisabled]="item.disabled ?? false"
            [cdkMenuTriggerFor]="dropdownTemplate"
          >
            {{ item.label }}
            <span class="caret"><glint-icon name="chevronDown" /></span>
          </button>
          <ng-template #dropdownTemplate>
            <div class="dropdown-menu" cdkMenu>
              @for (subItem of item.items; track subItem.label) {
                <button
                  class="dropdown-item"
                  cdkMenuItem
                  [cdkMenuItemDisabled]="subItem.disabled ?? false"
                  (cdkMenuItemTriggered)="onItemClick(subItem)"
                >
                  {{ subItem.label }}
                </button>
                @if (subItem.separator) {
                  <div class="separator" role="separator"></div>
                }
              }
            </div>
          </ng-template>
        } @else {
          <button
            class="menubar-item"
            cdkMenuItem
            [cdkMenuItemDisabled]="item.disabled ?? false"
            (cdkMenuItemTriggered)="onItemClick(item)"
          >
            {{ item.label }}
          </button>
        }
      }
    </div>
  `,
})
export class GlintMenuBarComponent {
  /** Top-level menu items that form the horizontal bar */
  items = input.required<GlintMenuItem[]>();

  protected onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }
}
