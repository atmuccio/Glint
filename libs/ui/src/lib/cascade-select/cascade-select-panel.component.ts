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
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { SUBMENU_POSITIONS } from '../core/overlay/overlay-positions';
import type { GlintMenuItem } from '../menu/menu-item.model';

/**
 * Internal panel component for CascadeSelect. Renders a list of items and
 * recursively opens sub-panels for items with children.
 *
 * Not exported from the public API.
 */
@Component({
  selector: 'glint-cascade-select-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'listbox',
    '(keydown)': 'onKeydown($event)',
  },
  styles: `
    :host {
      display: block;
      min-inline-size: max(12rem, 100%);
      box-sizing: border-box;
      padding-block: var(--glint-spacing-xs);
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: var(--glint-shadow);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
      overflow: auto;
      max-block-size: 16rem;
    }

    .cascade-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
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

    .cascade-item:hover:not(.disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .cascade-item:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .cascade-item.active {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    .cascade-item.disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .submenu-indicator {
      font-size: 0.625rem;
      flex-shrink: 0;
    }
  `,
  template: `
    @for (item of items(); track item.label) {
      @if (item.visible !== false) {
        <button
          #itemEl
          class="cascade-item"
          [class.disabled]="item.disabled"
          [class.active]="activeIndex() === $index"
          role="option"
          [attr.aria-selected]="activeIndex() === $index"
          [attr.aria-disabled]="item.disabled || null"
          [tabindex]="item.disabled ? -1 : 0"
          (click)="onItemClick(item, $index)"
          (mouseenter)="onItemHover(item, $index)"
        >
          <span>{{ item.label }}</span>
          @if (item.items && item.items.length > 0) {
            <span class="submenu-indicator" aria-hidden="true">&#9654;</span>
          }
        </button>
      }
    }
  `,
})
export class CascadeSelectPanelComponent {
  items = signal<GlintMenuItem[]>([]);
  itemSelected = output<GlintMenuItem>();
  activeIndex = signal<number>(-1);

  private itemEls = viewChildren<ElementRef<HTMLButtonElement>>('itemEl');
  private overlay = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private elRef = inject(ElementRef);
  private destroyRef = inject(DestroyRef);

  private subOverlayRef: OverlayRef | null = null;
  private subPanelInstance: CascadeSelectPanelComponent | null = null;
  private currentSubIndex = -1;

  constructor() {
    this.destroyRef.onDestroy(() => this.closeSubPanel());
  }

  onItemClick(item: GlintMenuItem, index: number): void {
    if (item.disabled) return;

    if (item.items && item.items.length > 0) {
      this.openSubPanel(item, index);
    } else {
      this.itemSelected.emit(item);
    }
  }

  onItemHover(item: GlintMenuItem, index: number): void {
    this.activeIndex.set(index);

    if (item.disabled) return;

    if (item.items && item.items.length > 0) {
      this.openSubPanel(item, index);
    } else {
      this.closeSubPanel();
    }
  }

  onKeydown(event: KeyboardEvent): void {
    const visibleItems = this.getVisibleItems();
    if (visibleItems.length === 0) return;

    const activeIdx = this.activeIndex();
    const els = this.itemEls().map(e => e.nativeElement);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        event.stopPropagation();
        this.setActiveByIndex(Math.min(activeIdx + 1, visibleItems.length - 1), els);
        break;
      case 'ArrowUp':
        event.preventDefault();
        event.stopPropagation();
        this.setActiveByIndex(Math.max(activeIdx - 1, 0), els);
        break;
      case 'ArrowRight':
        event.preventDefault();
        event.stopPropagation();
        if (activeIdx >= 0 && activeIdx < visibleItems.length) {
          const item = visibleItems[activeIdx];
          if (item.items && item.items.length > 0) {
            this.openSubPanel(item, activeIdx);
            // Focus the first item in sub-panel
            setTimeout(() => {
              this.subPanelInstance?.focusFirst();
            });
          }
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        event.stopPropagation();
        // Handled by parent — close this panel
        this.closeSubPanel();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        event.stopPropagation();
        if (activeIdx >= 0 && activeIdx < visibleItems.length) {
          this.onItemClick(visibleItems[activeIdx], activeIdx);
        }
        break;
      case 'Escape':
        event.preventDefault();
        event.stopPropagation();
        if (this.subOverlayRef) {
          this.closeSubPanel();
        }
        // Else let it propagate to parent
        break;
    }
  }

  focusFirst(): void {
    const els = this.itemEls().map(e => e.nativeElement);
    if (els.length > 0) {
      this.activeIndex.set(0);
      els[0].focus();
    }
  }

  private getVisibleItems(): GlintMenuItem[] {
    return this.items().filter(item => item.visible !== false);
  }

  private setActiveByIndex(index: number, els: HTMLButtonElement[]): void {
    if (index >= 0 && index < els.length) {
      this.activeIndex.set(index);
      els[index].focus();
    }
  }

  private openSubPanel(item: GlintMenuItem, index: number): void {
    if (this.currentSubIndex === index && this.subOverlayRef) return;

    this.closeSubPanel();
    this.currentSubIndex = index;

    const els = this.itemEls().map(e => e.nativeElement);
    const triggerEl = els[index];
    if (!triggerEl) return;

    const config = new OverlayConfig({
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(triggerEl)
        .withPositions(SUBMENU_POSITIONS),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
    });

    const { overlayRef, injector } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.subOverlayRef = overlayRef;

    const portal = new ComponentPortal(CascadeSelectPanelComponent, null, injector);
    const ref = overlayRef.attach(portal);
    this.subPanelInstance = ref.instance;
    ref.instance.items.set(item.items || []);
    ref.instance.itemSelected.subscribe((selected: GlintMenuItem) => {
      this.itemSelected.emit(selected);
    });
  }

  closeSubPanel(): void {
    if (this.subOverlayRef) {
      this.subOverlayRef.dispose();
      this.subOverlayRef = null;
      this.subPanelInstance = null;
      this.currentSubIndex = -1;
    }
  }
}
