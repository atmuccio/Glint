import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { GlintMenuItem } from '../menu/menu-item.model';
import { GLINT_SHELL_SIDEBAR } from '../shell/shell.model';
import { GlintTooltipDirective } from '../tooltip/tooltip.directive';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Accordion-style vertical menu where top-level items expand/collapse
 * to show nested items inline (no overlays).
 *
 * When placed inside a `<glint-shell-sidebar>`, automatically detects
 * collapsed state and shows only icons with tooltips.
 *
 * @example
 * ```html
 * <glint-panel-menu [items]="menuItems" [multiple]="true" />
 * ```
 */
@Component({
  selector: 'glint-panel-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, GlintTooltipDirective, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
    'role': 'navigation',
    '[attr.data-collapsed]': 'isCollapsed() || null',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .panel-menu-header {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      inline-size: 100%;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border: none;
      border-block-end: 1px solid var(--glint-color-border);
      border-inline-start: 3px solid transparent;
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      font: inherit;
      font-weight: 600;
      cursor: pointer;
      text-align: start;
      text-decoration: none;
      overflow: hidden;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .panel-menu-header:hover:not(.disabled) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 15%);
    }

    .panel-menu-header:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .panel-menu-header.active {
      border-inline-start-color: var(--glint-color-primary);
    }

    .panel-menu-header.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .panel-menu-header > glint-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      flex-shrink: 0;
    }

    .panel-menu-label {
      flex: 1;
    }

    .chevron {
      font-size: 0.65em;
      transition: rotate var(--glint-duration-fast) var(--glint-easing);
    }

    .chevron.expanded {
      rotate: 90deg;
    }

    .panel-menu-submenu {
      background: var(--glint-color-surface);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .panel-menu-child,
    .panel-menu-grandchild {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      inline-size: 100%;
      padding-block: var(--glint-spacing-xs);
      padding-inline-end: var(--glint-spacing-md);
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      font: inherit;
      cursor: pointer;
      text-align: start;
      text-decoration: none;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .panel-menu-child {
      padding-inline-start: 2rem;
    }

    .panel-menu-grandchild {
      padding-inline-start: 3rem;
    }

    /* When icon is present, adjust child indent to align with icon */
    .panel-menu-child > glint-icon,
    .panel-menu-grandchild > glint-icon {
      inline-size: 1rem;
      block-size: 1rem;
    }

    .panel-menu-child:hover:not(.disabled),
    .panel-menu-grandchild:hover:not(.disabled) {
      background: var(--glint-color-surface-variant);
    }

    .panel-menu-child:focus-visible,
    .panel-menu-grandchild:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .panel-menu-child.disabled,
    .panel-menu-grandchild.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* Active route styling for child links */
    .panel-menu-child.route-active,
    .panel-menu-grandchild.route-active {
      color: var(--glint-color-primary);
      font-weight: 600;
    }

    /* --- Collapsed mode --- */
    :host([data-collapsed]) .panel-menu-header {
      justify-content: center;
      padding-inline: var(--glint-spacing-xs);
    }

    :host([data-collapsed]) .panel-menu-submenu {
      display: none;
    }
  `,
  template: `
    @for (item of items(); track item.label) {
      <div class="panel-menu-item">
        @if (item.routerLink && !item.items?.length) {
          <a
            class="panel-menu-header"
            [class.disabled]="item.disabled"
            [routerLink]="item.routerLink"
            routerLinkActive="active"
            [attr.aria-label]="isCollapsed() ? item.label : null"
            [glintTooltip]="item.label"
            [glintTooltipDisabled]="!isCollapsed()"
            glintTooltipPosition="after"
          >
            @if (item.icon) { <glint-icon [name]="item.icon" /> }
            @if (!isCollapsed()) { <span class="panel-menu-label">{{ item.label }}</span> }
          </a>
        } @else {
          <button
            class="panel-menu-header"
            [class.active]="isExpanded(item)"
            [class.disabled]="item.disabled"
            [attr.aria-expanded]="item.items?.length && !isCollapsed() ? isExpanded(item) : null"
            [attr.aria-disabled]="item.disabled || null"
            [attr.aria-label]="isCollapsed() ? item.label : null"
            [glintTooltip]="item.label"
            [glintTooltipDisabled]="!isCollapsed()"
            glintTooltipPosition="after"
            (click)="onToggle(item)"
          >
            @if (item.icon) { <glint-icon [name]="item.icon" /> }
            @if (!isCollapsed()) { <span class="panel-menu-label">{{ item.label }}</span> }
            @if (item.items?.length && !isCollapsed()) {
              <span class="chevron" [class.expanded]="isExpanded(item)" aria-hidden="true"><glint-icon name="chevronRight" /></span>
            }
          </button>
        }
        @if (isExpanded(item) && item.items?.length) {
          <div class="panel-menu-submenu" role="group">
            @for (child of item.items; track child.label) {
              @if (child.routerLink) {
                <a
                  class="panel-menu-child"
                  [class.disabled]="child.disabled"

                  [routerLink]="child.routerLink"
                  routerLinkActive="route-active"
                  [attr.aria-disabled]="child.disabled || null"
                >
                  @if (child.icon) { <glint-icon [name]="child.icon" /> }
                  {{ child.label }}
                </a>
              } @else {
                <button
                  class="panel-menu-child"
                  [class.disabled]="child.disabled"

                  [attr.aria-disabled]="child.disabled || null"
                  (click)="onChildClick(child)"
                >
                  @if (child.icon) { <glint-icon [name]="child.icon" /> }
                  {{ child.label }}
                </button>
              }
              @if (child.items?.length) {
                @for (grandchild of child.items; track grandchild.label) {
                  @if (grandchild.routerLink) {
                    <a
                      class="panel-menu-grandchild"
                      [class.disabled]="grandchild.disabled"
    
                      [routerLink]="grandchild.routerLink"
                      routerLinkActive="route-active"
                      [attr.aria-disabled]="grandchild.disabled || null"
                    >
                      @if (grandchild.icon) { <glint-icon [name]="grandchild.icon" /> }
                      {{ grandchild.label }}
                    </a>
                  } @else {
                    <button
                      class="panel-menu-grandchild"
                      [class.disabled]="grandchild.disabled"
    
                      [attr.aria-disabled]="grandchild.disabled || null"
                      (click)="onChildClick(grandchild)"
                    >
                      @if (grandchild.icon) { <glint-icon [name]="grandchild.icon" /> }
                      {{ grandchild.label }}
                    </button>
                  }
                }
              }
            }
          </div>
        }
      </div>
    }
  `,
})
export class GlintPanelMenuComponent {
  /** Menu items to display */
  items = input.required<GlintMenuItem[]>();

  /** Allow multiple panels open simultaneously */
  multiple = input(false);

  /** Tracks which top-level items are expanded */
  protected expandedItems = signal<Set<GlintMenuItem>>(new Set());

  /** Sidebar host (optional — only present when inside glint-shell-sidebar) */
  private sidebar = inject(GLINT_SHELL_SIDEBAR, { optional: true });

  /** Whether the panel menu is in collapsed mode (icons only) */
  protected isCollapsed = computed(() => this.sidebar?.collapsed() ?? false);

  /** Check if a top-level item is currently expanded */
  protected isExpanded(item: GlintMenuItem): boolean {
    return this.expandedItems().has(item);
  }

  /** Toggle a top-level item's expanded state */
  protected onToggle(item: GlintMenuItem): void {
    if (item.disabled) return;

    // In collapsed mode, don't expand submenus
    if (this.isCollapsed() && item.items?.length) {
      item.command?.();
      return;
    }

    const current = this.expandedItems();

    if (this.multiple()) {
      const next = new Set(current);
      if (next.has(item)) {
        next.delete(item);
      } else {
        next.add(item);
      }
      this.expandedItems.set(next);
    } else {
      if (current.has(item)) {
        this.expandedItems.set(new Set());
      } else {
        this.expandedItems.set(new Set([item]));
      }
    }
  }

  /** Handle child or grandchild item click */
  protected onChildClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }
}
