import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  viewChildren,
} from '@angular/core';
import { ConnectedPosition, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintMenuPanelComponent } from '../menu/menu-panel.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

const DROPDOWN_POSITIONS: ConnectedPosition[] = [
  { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 2 },
  { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -2 },
];

/**
 * Horizontal menu bar with dropdown submenus, similar to a desktop application menu bar.
 *
 * @example
 * ```html
 * <glint-menubar [items]="menuItems" />
 * ```
 */
@Component({
  selector: 'glint-menubar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'menubar',
    'style': 'display: block',
    '(keydown)': 'onKeydown($event)',
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

    .menubar-item:hover:not(.disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .menubar-item.active:not(.disabled) {
      color: var(--glint-color-primary);
      background: color-mix(in oklch, var(--glint-color-primary), transparent 92%);
    }

    .menubar-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .menubar-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .caret {
      font-size: 0.75em;
      margin-inline-start: var(--glint-spacing-xs);
    }
  `,
  template: `
    <div class="menubar">
      @for (item of items(); track item.label) {
        <div class="menubar-item-wrapper">
          <button
            #itemBtn
            class="menubar-item"
            role="menuitem"
            [class.disabled]="item.disabled"
            [class.active]="activeIndex() === $index"
            [attr.aria-haspopup]="item.items?.length ? 'true' : null"
            [attr.aria-expanded]="activeIndex() === $index && item.items?.length ? 'true' : null"
            [attr.aria-disabled]="item.disabled || null"
            (click)="onItemClick(item, $index)"
            (mouseenter)="onItemHover($index)"
          >
            {{ item.label }}
            @if (item.items?.length) {
              <span class="caret">&#9662;</span>
            }
          </button>
        </div>
      }
    </div>
  `,
})
export class GlintMenuBarComponent {
  /** Top-level menu items that form the horizontal bar */
  items = input.required<GlintMenuItem[]>();

  /** Index of the currently active (open dropdown) top-level item. -1 means none. */
  protected activeIndex = signal(-1);

  private readonly overlay = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly itemBtns = viewChildren<ElementRef<HTMLButtonElement>>('itemBtn');

  private overlayRef: OverlayRef | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.closeDropdown());
  }

  protected onItemClick(item: GlintMenuItem, index: number): void {
    if (item.disabled) return;

    if (item.items?.length) {
      // Toggle dropdown
      if (this.activeIndex() === index) {
        this.closeDropdown();
      } else {
        this.openDropdown(index);
      }
    } else {
      item.command?.();
      this.closeDropdown();
    }
  }

  protected onItemHover(index: number): void {
    // Only auto-open on hover if a dropdown is already open
    if (this.activeIndex() >= 0 && this.activeIndex() !== index) {
      const item = this.items()[index];
      if (item && !item.disabled) {
        this.openDropdown(index);
      }
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    const itemCount = this.items().length;
    if (itemCount === 0) return;

    switch (event.key) {
      case 'ArrowRight': {
        event.preventDefault();
        const next = this.findNextEnabled(this.activeIndex() >= 0 ? this.activeIndex() : -1, 1);
        if (next >= 0) {
          if (this.activeIndex() >= 0) {
            this.openDropdown(next);
          }
          this.focusItem(next);
        }
        break;
      }
      case 'ArrowLeft': {
        event.preventDefault();
        const current = this.activeIndex() >= 0 ? this.activeIndex() : this.items().length;
        const prev = this.findNextEnabled(current, -1);
        if (prev >= 0) {
          if (this.activeIndex() >= 0) {
            this.openDropdown(prev);
          }
          this.focusItem(prev);
        }
        break;
      }
      case 'ArrowDown': {
        event.preventDefault();
        const focused = this.getFocusedIndex();
        if (focused >= 0 && this.items()[focused]?.items?.length) {
          this.openDropdown(focused);
        }
        break;
      }
      case 'Escape': {
        if (this.activeIndex() >= 0) {
          event.preventDefault();
          const idx = this.activeIndex();
          this.closeDropdown();
          this.focusItem(idx);
        }
        break;
      }
      case 'Home': {
        event.preventDefault();
        const first = this.findNextEnabled(-1, 1);
        if (first >= 0) this.focusItem(first);
        break;
      }
      case 'End': {
        event.preventDefault();
        const last = this.findNextEnabled(this.items().length, -1);
        if (last >= 0) this.focusItem(last);
        break;
      }
    }
  }

  private openDropdown(index: number): void {
    const item = this.items()[index];
    if (!item?.items?.length) {
      this.closeDropdown();
      this.activeIndex.set(index);
      return;
    }

    // Close any existing dropdown first
    this.disposeOverlay();

    const btnEls = this.itemBtns();
    const triggerEl = btnEls[index]?.nativeElement;
    if (!triggerEl) return;

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(triggerEl)
      .withPositions(DROPDOWN_POSITIONS);

    const config = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef, injector } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.overlayRef = overlayRef;

    const portal = new ComponentPortal(GlintMenuPanelComponent, null, injector);
    const ref = overlayRef.attach(portal);
    ref.instance.items.set(item.items);
    ref.instance.itemSelected.subscribe((selected: GlintMenuItem) => {
      selected.command?.();
      this.closeDropdown();
    });

    overlayRef.backdropClick().subscribe(() => this.closeDropdown());
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        const idx = this.activeIndex();
        this.closeDropdown();
        this.focusItem(idx);
      }
    });

    this.activeIndex.set(index);
  }

  private closeDropdown(): void {
    this.disposeOverlay();
    this.activeIndex.set(-1);
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }

  private focusItem(index: number): void {
    const btnEls = this.itemBtns();
    btnEls[index]?.nativeElement.focus();
  }

  private getFocusedIndex(): number {
    const btnEls = this.itemBtns();
    return btnEls.findIndex(el => el.nativeElement === document.activeElement);
  }

  private findNextEnabled(from: number, direction: 1 | -1): number {
    const items = this.items();
    let i = from + direction;
    while (i >= 0 && i < items.length) {
      if (!items[i].disabled) return i;
      i += direction;
    }
    return -1;
  }
}
