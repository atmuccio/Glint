import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ConnectedPosition, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintTieredMenuPanelComponent } from './tiered-menu-panel.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

const POSITIONS: ConnectedPosition[] = [
  {
    originX: 'start',
    originY: 'bottom',
    overlayX: 'start',
    overlayY: 'top',
    offsetY: 4,
  },
  {
    originX: 'start',
    originY: 'top',
    overlayX: 'start',
    overlayY: 'bottom',
    offsetY: -4,
  },
  {
    originX: 'end',
    originY: 'bottom',
    overlayX: 'end',
    overlayY: 'top',
    offsetY: 4,
  },
  {
    originX: 'end',
    originY: 'top',
    overlayX: 'end',
    overlayY: 'bottom',
    offsetY: -4,
  },
];

/**
 * Tiered menu component with nested submenus.
 * Can be used inline (default) or as a popup overlay.
 *
 * @example Inline:
 * ```html
 * <glint-tiered-menu [items]="menuItems" />
 * ```
 *
 * @example Popup:
 * ```html
 * <glint-button (click)="tieredMenu.toggle()">Actions</glint-button>
 * <glint-tiered-menu #tieredMenu [items]="menuItems" [popup]="true" />
 * ```
 */
@Component({
  selector: 'glint-tiered-menu',
  standalone: true,
  imports: [GlintTieredMenuPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.popup]': 'popup()',
  },
  styles: `
    :host {
      display: block;
    }

    :host.popup {
      display: none;
    }
  `,
  template: `
    @if (!popup()) {
      <glint-tiered-menu-panel #inlinePanel />
    }
  `,
})
export class GlintTieredMenuComponent {
  /** Menu items to display */
  items = input.required<GlintMenuItem[]>();
  /** Whether to render as a popup overlay (true) or inline (false) */
  popup = input(false);
  /** Emitted when the popup menu is closed */
  closed = output<void>();
  /** Target element to position against when in popup mode */
  target = input<ElementRef | HTMLElement | undefined>(undefined);

  private readonly overlay = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly elRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private overlayRef: import('@angular/cdk/overlay').OverlayRef | null = null;
  private isOpen = signal(false);

  /** Reference to the inline panel component */
  private readonly inlinePanel =
    viewChild<GlintTieredMenuPanelComponent>('inlinePanel');

  constructor() {
    this.destroyRef.onDestroy(() => this.close());

    // Sync items to the inline panel whenever items change
    effect(() => {
      const panel = this.inlinePanel();
      const items = this.items();
      if (panel) {
        panel.items.set(items);
      }
    });
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isOpen() || !this.popup()) return;

    const targetEl = this.resolveTarget();
    const positionStrategy = this.overlay
      .position()
      .flexibleConnectedTo(targetEl)
      .withPositions(POSITIONS);

    const config = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef, injector } = this.overlay.createZoneAwareOverlay(
      config,
      this.injector
    );
    this.overlayRef = overlayRef;

    const portal = new ComponentPortal(
      GlintTieredMenuPanelComponent,
      null,
      injector
    );
    const ref = overlayRef.attach(portal);
    ref.instance.items.set(this.items());
    ref.instance.itemSelected.subscribe((item: GlintMenuItem) => {
      item.command?.();
      this.close();
    });

    overlayRef.backdropClick().subscribe(() => this.close());
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.close();
      }
    });

    this.isOpen.set(true);
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);
    this.closed.emit();
  }

  private resolveTarget(): ElementRef | HTMLElement {
    const t = this.target();
    if (t) return t;
    const prev = this.elRef.nativeElement.previousElementSibling as HTMLElement;
    if (prev) return prev;
    return this.elRef;
  }
}
