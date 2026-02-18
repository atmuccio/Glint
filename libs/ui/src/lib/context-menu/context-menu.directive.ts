import {
  DestroyRef,
  Directive,
  inject,
  Injector,
  input,
} from '@angular/core';
import { OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintMenuPanelComponent } from '../menu/menu-panel.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

/**
 * Context menu directive that shows a menu panel at the pointer position on right-click.
 * Reuses the existing `GlintMenuPanelComponent` for rendering.
 *
 * @example
 * ```html
 * <div [glintContextMenu]="menuItems">Right-click me</div>
 * ```
 */
@Directive({
  selector: '[glintContextMenu]',
  standalone: true,
  host: {
    '(contextmenu)': 'onContextMenu($event)',
  },
})
export class GlintContextMenuDirective {
  /** Menu items to display in the context menu */
  glintContextMenu = input.required<GlintMenuItem[]>();

  private readonly overlay = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private overlayRef: import('@angular/cdk/overlay').OverlayRef | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => this.close());
  }

  protected onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.close();

    const positionStrategy = this.overlay
      .position()
      .global()
      .left(event.clientX + 'px')
      .top(event.clientY + 'px');

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

    const portal = new ComponentPortal(GlintMenuPanelComponent, null, injector);
    const ref = overlayRef.attach(portal);
    ref.instance.items.set(this.glintContextMenu());
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
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
