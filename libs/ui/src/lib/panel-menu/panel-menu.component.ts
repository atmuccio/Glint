import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
} from '@angular/core';
import type { GlintMenuItem } from '../menu/menu-item.model';

/**
 * Accordion-style vertical menu where top-level items expand/collapse
 * to show nested items inline (no overlays).
 *
 * @example
 * ```html
 * <glint-panel-menu [items]="menuItems" [multiple]="true" />
 * ```
 */
@Component({
  selector: 'glint-panel-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'style': 'display: block',
    'role': 'navigation',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .panel-menu-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      display: block;
      inline-size: 100%;
      padding-block: var(--glint-spacing-xs);
      padding-inline-end: var(--glint-spacing-md);
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      font: inherit;
      cursor: pointer;
      text-align: start;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .panel-menu-child {
      padding-inline-start: 2rem;
    }

    .panel-menu-grandchild {
      padding-inline-start: 3rem;
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
  `,
  template: `
    @for (item of items(); track item.label) {
      <div class="panel-menu-item">
        <button
          class="panel-menu-header"
          [class.active]="isExpanded(item)"
          [class.disabled]="item.disabled"
          [attr.aria-expanded]="item.items?.length ? isExpanded(item) : null"
          [attr.aria-disabled]="item.disabled || null"
          (click)="onToggle(item)"
        >
          <span class="panel-menu-label">{{ item.label }}</span>
          @if (item.items?.length) {
            <span class="chevron" [class.expanded]="isExpanded(item)" aria-hidden="true">\u25B6</span>
          }
        </button>
        @if (isExpanded(item) && item.items?.length) {
          <div class="panel-menu-submenu" role="group">
            @for (child of item.items; track child.label) {
              <button
                class="panel-menu-child"
                [class.disabled]="child.disabled"
                role="menuitem"
                [attr.aria-disabled]="child.disabled || null"
                (click)="onChildClick(child)"
              >
                {{ child.label }}
              </button>
              @if (child.items?.length) {
                @for (grandchild of child.items; track grandchild.label) {
                  <button
                    class="panel-menu-grandchild"
                    [class.disabled]="grandchild.disabled"
                    role="menuitem"
                    [attr.aria-disabled]="grandchild.disabled || null"
                    (click)="onChildClick(grandchild)"
                  >
                    {{ grandchild.label }}
                  </button>
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
  expandedItems = signal<Set<GlintMenuItem>>(new Set());

  /** Check if a top-level item is currently expanded */
  isExpanded(item: GlintMenuItem): boolean {
    return this.expandedItems().has(item);
  }

  /** Toggle a top-level item's expanded state */
  onToggle(item: GlintMenuItem): void {
    if (item.disabled) return;

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
  onChildClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }
}
