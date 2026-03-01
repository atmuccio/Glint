import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  input,
  model,
  output,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Drawer (side panel) component that slides in from the edge.
 *
 * @example
 * ```html
 * <glint-button (click)="drawerVisible = true">Open Drawer</glint-button>
 * <glint-drawer [(visible)]="drawerVisible" position="right" header="Settings">
 *   <p>Drawer content…</p>
 * </glint-drawer>
 * ```
 */
@Component({
  selector: 'glint-drawer',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: `
    .drawer-container {
      display: flex;
      flex-direction: column;
      block-size: 100%;
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      box-shadow: var(--glint-shadow);
    }

    .drawer-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--glint-spacing-md);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .drawer-title {
      font-weight: 600;
      font-size: 1.125rem;
      margin: 0;
    }

    .drawer-close {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2rem;
      block-size: 2rem;
      border: none;
      border-radius: var(--glint-border-radius);
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      font-size: 1.125rem;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }
    .drawer-close:hover { background: var(--glint-color-surface-variant); }
    .drawer-close:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .drawer-body {
      flex: 1;
      overflow-y: auto;
      padding: var(--glint-spacing-md);
    }
  `,
  template: `
    <ng-template #drawerTemplate>
      <div class="drawer-container" role="dialog" aria-modal="true">
        @if (header()) {
          <div class="drawer-header">
            <h2 class="drawer-title">{{ header() }}</h2>
            <button class="drawer-close" aria-label="Close" (click)="close()"><glint-icon name="x" /></button>
          </div>
        }
        <div class="drawer-body">
          <ng-content />
        </div>
      </div>
    </ng-template>
  `,
})
export class GlintDrawerComponent {
  /** Whether the drawer is visible (two-way bindable) */
  visible = model(false);
  /** Position */
  position = input<'left' | 'right' | 'top' | 'bottom'>('right');
  /** Header text */
  header = input('');
  /** Drawer width (for left/right) or height (for top/bottom) */
  size = input('20rem');
  /** Emitted when the drawer is closed */
  closed = output<void>();

  private overlay = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private vcr = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);
  private overlayRef: OverlayRef | null = null;
  private drawerTemplate = viewChild.required<TemplateRef<unknown>>('drawerTemplate');

  constructor() {
    this.destroyRef.onDestroy(() => this.disposeOverlay());
  }

  open(): void {
    if (this.overlayRef) return;

    const pos = this.position();
    const sz = this.size();

    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global()
        .top(pos === 'bottom' ? '' : '0')
        .bottom(pos === 'top' ? '' : '0')
        .left(pos === 'right' ? '' : '0')
        .right(pos === 'left' ? '' : '0'),
      hasBackdrop: true,
      width: (pos === 'left' || pos === 'right') ? sz : '100%',
      height: (pos === 'top' || pos === 'bottom') ? sz : '100%',
    });

    const { overlayRef } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.drawerTemplate(), this.vcr);
    overlayRef.attach(portal);

    overlayRef.backdropClick().subscribe(() => this.close());
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') this.close();
    });

    this.visible.set(true);
  }

  close(): void {
    this.disposeOverlay();
    this.visible.set(false);
    this.closed.emit();
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
