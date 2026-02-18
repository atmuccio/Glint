import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  output,
  signal,
  viewChildren,
} from '@angular/core';
import { ConnectedPosition, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import type { GlintMenuItem } from '../menu/menu-item.model';

const SUBMENU_POSITIONS: ConnectedPosition[] = [
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'top',
    offsetX: 2,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'top',
    offsetX: -2,
  },
];

/**
 * Internal panel component for TieredMenu.
 * Renders menu items and handles nested submenu opening via CDK overlays.
 */
@Component({
  selector: 'glint-tiered-menu-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'menu',
    '(keydown)': 'onKeydown($event)',
  },
  styles: `
    :host {
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

    .menu-item:hover:not(.disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .menu-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .menu-item.disabled {
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
    @for (item of items(); track item.label) {
      <button
        #itemEl
        class="menu-item"
        [class.disabled]="item.disabled"
        role="menuitem"
        [attr.aria-disabled]="item.disabled || null"
        [attr.aria-haspopup]="item.items?.length ? 'true' : null"
        [tabindex]="item.disabled ? -1 : 0"
        (click)="onItemClick(item)"
        (mouseenter)="onItemMouseEnter(item, $event)"
      >
        <span class="menu-item-label">{{ item.label }}</span>
        @if (item.items?.length) {
          <span class="submenu-indicator" aria-hidden="true">&#9654;</span>
        }
      </button>
      @if (item.separator) {
        <div class="separator" role="separator"></div>
      }
    }
  `,
})
export class GlintTieredMenuPanelComponent {
  items = signal<GlintMenuItem[]>([]);
  itemSelected = output<GlintMenuItem>();
  /** Emitted when user presses ArrowLeft or Escape to close this submenu */
  closeRequested = output<void>();

  private readonly overlay = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private itemEls = viewChildren<ElementRef<HTMLButtonElement>>('itemEl');

  private activeSubmenuRef: import('@angular/cdk/overlay').OverlayRef | null =
    null;
  private activeSubmenuItem: GlintMenuItem | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.closeSubmenu());
  }

  onItemClick(item: GlintMenuItem): void {
    if (item.disabled) return;
    if (item.items?.length) {
      return; // Items with children open submenus, don't emit
    }
    this.itemSelected.emit(item);
  }

  onItemMouseEnter(item: GlintMenuItem, event: Event): void {
    if (item.disabled) return;

    // Close current submenu if hovering a different item
    if (this.activeSubmenuItem !== item) {
      this.closeSubmenu();
    }

    if (item.items?.length && this.activeSubmenuItem !== item) {
      this.openSubmenu(item, event.target as HTMLElement);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const els = this.itemEls().map((e) => e.nativeElement);
    const current = els.indexOf(document.activeElement as HTMLButtonElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      event.stopPropagation();
      const next = this.findNext(current, 1, els);
      if (next >= 0) els[next].focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      event.stopPropagation();
      const next = this.findNext(current, -1, els);
      if (next >= 0) els[next].focus();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      event.stopPropagation();
      if (current >= 0) {
        const visibleItems = this.items().filter((i) => i.visible !== false);
        const item = visibleItems[current];
        if (item?.items?.length && !item.disabled) {
          this.openSubmenu(item, els[current]);
        }
      }
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      event.stopPropagation();
      this.closeRequested.emit();
    } else if (event.key === 'Home') {
      event.preventDefault();
      event.stopPropagation();
      const next = this.findNext(-1, 1, els);
      if (next >= 0) els[next].focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      event.stopPropagation();
      const next = this.findNext(els.length, -1, els);
      if (next >= 0) els[next].focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      if (current >= 0) {
        const visibleItems = this.items().filter((i) => i.visible !== false);
        const item = visibleItems[current];
        if (item) this.onItemClick(item);
      }
    }
  }

  private openSubmenu(item: GlintMenuItem, triggerEl: HTMLElement): void {
    this.closeSubmenu();

    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(triggerEl)
      .withPositions(SUBMENU_POSITIONS);

    const config = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const { overlayRef, injector } = this.overlay.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.activeSubmenuRef = overlayRef;
    this.activeSubmenuItem = item;

    const portal = new ComponentPortal(
      GlintTieredMenuPanelComponent,
      null,
      injector
    );
    const ref = overlayRef.attach(portal);
    ref.instance.items.set(item.items ?? []);

    ref.instance.itemSelected.subscribe((selected: GlintMenuItem) => {
      this.itemSelected.emit(selected);
    });

    ref.instance.closeRequested.subscribe(() => {
      this.closeSubmenu();
      // Return focus to the trigger item
      const els = this.itemEls().map((e) => e.nativeElement);
      const visibleItems = this.items().filter((i) => i.visible !== false);
      const idx = visibleItems.indexOf(item);
      if (idx >= 0 && els[idx]) {
        els[idx].focus();
      }
    });
  }

  closeSubmenu(): void {
    if (this.activeSubmenuRef) {
      this.activeSubmenuRef.dispose();
      this.activeSubmenuRef = null;
      this.activeSubmenuItem = null;
    }
  }

  private findNext(
    from: number,
    dir: 1 | -1,
    els: HTMLButtonElement[]
  ): number {
    let i = from + dir;
    while (i >= 0 && i < els.length) {
      if (!els[i].classList.contains('disabled')) return i;
      i += dir;
    }
    return -1;
  }
}
