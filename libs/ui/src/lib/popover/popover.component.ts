import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ConnectedPosition, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';

const POSITIONS: ConnectedPosition[] = [
  { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top', offsetY: 8 },
  { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom', offsetY: -8 },
  { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center', offsetX: 8 },
  { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center', offsetX: -8 },
];

/**
 * Popover for rich content triggered on click.
 *
 * @example
 * ```html
 * <glint-button (click)="popover.toggle()">Info</glint-button>
 * <glint-popover #popover>
 *   <p>Rich popover content with <strong>markup</strong></p>
 * </glint-popover>
 * ```
 */
@Component({
  selector: 'glint-popover',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #popoverTemplate>
      <div class="popover-panel" role="dialog">
        <ng-content />
      </div>
    </ng-template>
  `,
  styles: `
    :host { display: none; }

    .popover-panel {
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: var(--glint-shadow);
      padding: var(--glint-spacing-md);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      max-inline-size: 20rem;
    }
  `,
})
export class GlintPopoverComponent {
  /** Target element to position against */
  target = input<ElementRef | HTMLElement | undefined>(undefined);

  private overlay = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private elRef = inject(ElementRef);
  private vcr = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);
  private overlayRef: OverlayRef | null = null;
  private isOpen = signal(false);
  private popoverTemplate = viewChild.required<TemplateRef<unknown>>('popoverTemplate');

  constructor() {
    this.destroyRef.onDestroy(() => this.close());
  }

  toggle(): void {
    if (this.isOpen()) { this.close(); } else { this.open(); }
  }

  open(): void {
    if (this.isOpen()) return;

    const targetEl = this.target() ?? this.elRef.nativeElement.previousElementSibling;
    const config = new OverlayConfig({
      positionStrategy: this.overlay.position()
        .flexibleConnectedTo(targetEl)
        .withPositions(POSITIONS),
      scrollStrategy: this.overlay.scrollStrategies.reposition(),
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.popoverTemplate(), this.vcr);
    overlayRef.attach(portal);

    overlayRef.backdropClick().subscribe(() => this.close());
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') this.close();
    });

    this.isOpen.set(true);
  }

  close(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);
  }
}
