import {
  ChangeDetectionStrategy,
  Component,
  output,
  signal,
} from '@angular/core';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import type { GlintMenuItem } from '../menu/menu-item.model';

/**
 * Internal panel component for TieredMenu.
 * Renders menu items and handles nested submenu opening via CDK Menu directives.
 * CdkMenu handles keyboard navigation (ArrowDown/Up/Left/Right), focus management,
 * ARIA roles, and submenu coordination.
 *
 * Note: This component supports one level of submenu nesting inline.
 * For deeper nesting, CDK Menu's CdkMenuTrigger recursively opens submenus via overlays.
 */
@Component({
  selector: 'glint-tiered-menu-panel',
  standalone: true,
  imports: [CdkMenu, CdkMenuItem, CdkMenuTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    :host {
      display: contents;
    }

    .glint-tiered-menu {
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

    .menu-item {
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

    .menu-item:hover:not([aria-disabled="true"]) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .menu-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .menu-item[aria-disabled="true"] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .menu-item-label {
      flex: 1 1 auto;
    }

    .submenu-indicator {
      flex: 0 0 auto;
      font-size: 0.625rem;
    }

    .separator {
      block-size: 1px;
      background: var(--glint-color-border);
      margin-block: var(--glint-spacing-xs);
    }
  `,
  template: `
    <div class="glint-tiered-menu" cdkMenu>
      @for (item of items(); track item.label) {
        @if (item.items?.length) {
          <button
            class="menu-item"
            cdkMenuItem
            [cdkMenuItemDisabled]="item.disabled ?? false"
            [cdkMenuTriggerFor]="submenuTemplate"
          >
            <span class="menu-item-label">{{ item.label }}</span>
            <span class="submenu-indicator" aria-hidden="true">&#9654;</span>
          </button>
          <ng-template #submenuTemplate>
            <div class="glint-tiered-menu" cdkMenu>
              @for (subItem of item.items; track subItem.label) {
                @if (subItem.items?.length) {
                  <button
                    class="menu-item"
                    cdkMenuItem
                    [cdkMenuItemDisabled]="subItem.disabled ?? false"
                    [cdkMenuTriggerFor]="nestedSubmenuTemplate"
                  >
                    <span class="menu-item-label">{{ subItem.label }}</span>
                    <span class="submenu-indicator" aria-hidden="true">&#9654;</span>
                  </button>
                  <ng-template #nestedSubmenuTemplate>
                    <div class="glint-tiered-menu" cdkMenu>
                      @for (deepItem of subItem.items; track deepItem.label) {
                        <button
                          class="menu-item"
                          cdkMenuItem
                          [cdkMenuItemDisabled]="deepItem.disabled ?? false"
                          (cdkMenuItemTriggered)="onItemClick(deepItem)"
                        >
                          <span class="menu-item-label">{{ deepItem.label }}</span>
                        </button>
                        @if (deepItem.separator) {
                          <div class="separator" role="separator"></div>
                        }
                      }
                    </div>
                  </ng-template>
                } @else {
                  <button
                    class="menu-item"
                    cdkMenuItem
                    [cdkMenuItemDisabled]="subItem.disabled ?? false"
                    (cdkMenuItemTriggered)="onItemClick(subItem)"
                  >
                    <span class="menu-item-label">{{ subItem.label }}</span>
                  </button>
                }
                @if (subItem.separator) {
                  <div class="separator" role="separator"></div>
                }
              }
            </div>
          </ng-template>
        } @else {
          <button
            class="menu-item"
            cdkMenuItem
            [cdkMenuItemDisabled]="item.disabled ?? false"
            (cdkMenuItemTriggered)="onItemClick(item)"
          >
            <span class="menu-item-label">{{ item.label }}</span>
          </button>
        }
        @if (item.separator) {
          <div class="separator" role="separator"></div>
        }
      }
    </div>
  `,
})
export class GlintTieredMenuPanelComponent {
  items = signal<GlintMenuItem[]>([]);
  itemSelected = output<GlintMenuItem>();
  /** Emitted when user presses ArrowLeft or Escape to close this submenu */
  closeRequested = output<void>();

  onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    if (item.items?.length) {
      return; // Items with children open submenus, don't emit
    }
    this.itemSelected.emit(item);
  }
}
