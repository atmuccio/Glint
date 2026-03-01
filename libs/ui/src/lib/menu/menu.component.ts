import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
} from '@angular/core';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { createDropdownOverlayConfig } from '../core/overlay/overlay-config-factory';
import { GlintMenuPanelComponent } from './menu-panel.component';
import type { GlintMenuItem } from './menu-item.model';

/**
 * Menu trigger component. Attach to a trigger element and provide menu items.
 * Uses Angular CDK Menu primitives (CdkMenu + CdkMenuItem) for keyboard
 * navigation, focus management, and ARIA roles within the panel.
 *
 * @example
 * ```html
 * <glint-button (click)="menu.toggle()">Actions</glint-button>
 * <glint-menu #menu [items]="menuItems" />
 * ```
 */
@Component({
  selector: 'glint-menu',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: '',
  styles: `:host { display: none; }`,
})
export class GlintMenuComponent {
  /** Menu items to display */
  items = input.required<GlintMenuItem[]>();
  /** Target element to position against */
  target = input<ElementRef | HTMLElement | undefined>(undefined);
  /** Emitted when the menu is closed */
  closed = output<void>();

  private readonly overlay = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly elRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);
  private panelRef: import('@angular/cdk/overlay').OverlayRef | null = null;
  private isOpen = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.close());
  }

  toggle(): void {
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  open(): void {
    if (this.isOpen()) return;

    const targetEl = this.resolveTarget();

    const config = createDropdownOverlayConfig(this.overlay, targetEl);

    const { overlayRef, injector } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.panelRef = overlayRef;

    const portal = new ComponentPortal(GlintMenuPanelComponent, null, injector);
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
    if (this.panelRef) {
      this.panelRef.dispose();
      this.panelRef = null;
    }
    this.isOpen.set(false);
    this.closed.emit();
  }

  private resolveTarget(): ElementRef | HTMLElement {
    const t = this.target();
    if (t) return t;
    // Fall back to the previous sibling (the trigger button)
    const prev = this.elRef.nativeElement.previousElementSibling as HTMLElement;
    if (prev) return prev;
    return this.elRef;
  }
}
