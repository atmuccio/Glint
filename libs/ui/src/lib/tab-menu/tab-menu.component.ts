import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  signal,
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import type { GlintMenuItem } from '../menu/menu-item.model';
import { GlintIconComponent } from '../icon/icon.component';

let nextId = 0;

/**
 * Route-based horizontal tab navigation.
 *
 * Renders a horizontal tab bar from a `GlintMenuItem[]` array.
 * Items with `routerLink` render as `<a>` elements with Angular router
 * integration; items with only `command` render as `<button>` elements.
 *
 * @example
 * ```html
 * <glint-tab-menu [items]="navItems" />
 * ```
 */
@Component({
  selector: 'glint-tab-menu',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'glint-tab-menu',
    'style': 'display: block',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .tab-list {
      display: flex;
      border-block-end: 2px solid var(--glint-color-border);
      gap: 0;
    }

    .tab-item {
      position: relative;
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-lg);
      border: none;
      background: transparent;
      color: var(--glint-color-text-muted);
      font: inherit;
      font-weight: 500;
      cursor: pointer;
      white-space: nowrap;
      text-decoration: none;
      transition:
        color var(--glint-duration-fast) var(--glint-easing),
        background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .tab-item:hover:not(.disabled) {
      color: var(--glint-color-text);
      background: color-mix(in oklch, var(--glint-color-primary), transparent 92%);
    }

    .tab-item.active {
      color: var(--glint-color-primary);
    }

    .tab-item.active::after {
      content: '';
      position: absolute;
      inset-block-end: -2px;
      inset-inline: 0;
      block-size: 2px;
      background: var(--glint-color-primary);
    }

    .tab-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .tab-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  template: `
    <div class="tab-list" role="tablist" tabindex="-1" (keydown)="onKeydown($event)">
      @for (item of visibleItems(); track item.label; let i = $index) {
        @if (item.routerLink) {
          <a
            class="tab-item"
            [class.disabled]="item.disabled"
            role="tab"
            [id]="tabId + '-' + i"
            [routerLink]="item.disabled ? null : item.routerLink"
            routerLinkActive="active"
            [attr.aria-disabled]="item.disabled || null"
            [tabindex]="focusedIndex() === i ? 0 : -1"
          >
            @if (item.icon) { <glint-icon [name]="item.icon" /> }
            {{ item.label }}
          </a>
        } @else {
          <button
            class="tab-item"
            [class.disabled]="item.disabled"
            role="tab"
            [id]="tabId + '-' + i"
            [attr.aria-disabled]="item.disabled || null"
            [tabindex]="focusedIndex() === i ? 0 : -1"
            (click)="onItemClick(item)"
          >
            @if (item.icon) { <glint-icon [name]="item.icon" /> }
            {{ item.label }}
          </button>
        }
      }
    </div>
  `,
})
export class GlintTabMenuComponent {
  /** Menu items to display as tabs */
  readonly items = input.required<GlintMenuItem[]>();

  /** Unique ID prefix for tab elements */
  protected readonly tabId = `glint-tab-menu-${nextId++}`;

  /** Index of the currently focused tab (for roving tabindex) */
  protected readonly focusedIndex = signal(0);

  /** Visible items (filtered by `visible !== false`) */
  protected readonly visibleItems = computed(() =>
    this.items().filter(item => item.visible !== false),
  );

  /** Handle item click for command-based items */
  protected onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    item.command?.();
  }

  /** Keyboard navigation: ArrowLeft/Right (wrapping), Home/End */
  protected onKeydown(event: KeyboardEvent): void {
    const items = this.visibleItems();
    const current = this.focusedIndex();
    let next = -1;

    if (event.key === 'ArrowRight') {
      next = this.findNextEnabled(current, 1, items);
    } else if (event.key === 'ArrowLeft') {
      next = this.findNextEnabled(current, -1, items);
    } else if (event.key === 'Home') {
      next = this.findNextEnabled(-1, 1, items);
    } else if (event.key === 'End') {
      next = this.findNextEnabled(items.length, -1, items);
    }

    if (next >= 0 && next !== current) {
      event.preventDefault();
      this.focusedIndex.set(next);
      this.focusTab(next);
    }
  }

  private findNextEnabled(
    from: number,
    direction: 1 | -1,
    items: readonly GlintMenuItem[],
  ): number {
    const len = items.length;
    if (len === 0) return -1;

    let i = from + direction;
    // Wrap around
    if (i < 0) i = len - 1;
    if (i >= len) i = 0;

    const start = i;
    do {
      if (!items[i].disabled) return i;
      i += direction;
      if (i < 0) i = len - 1;
      if (i >= len) i = 0;
    } while (i !== start);

    return -1;
  }

  private focusTab(index: number): void {
    const el = document.getElementById(`${this.tabId}-${index}`);
    el?.focus();
  }
}
