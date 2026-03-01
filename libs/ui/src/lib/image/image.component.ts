import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Injector,
  input,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Image component with optional fullscreen preview.
 *
 * When `preview` is enabled, clicking the image opens a fullscreen overlay
 * displaying the image at full size with a close button.
 *
 * @example
 * ```html
 * <glint-image src="/photo.jpg" alt="A photo" [preview]="true" />
 * ```
 */
@Component({
  selector: 'glint-image',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'glint-image',
  },
  template: `
    <img
      [src]="src()"
      [alt]="alt()"
      [style.inline-size]="width()"
      [style.block-size]="height()"
      [class]="imageClass()"
      [class.previewable]="preview()"
      [tabindex]="preview() ? 0 : -1"
      [attr.role]="preview() ? 'button' : null"
      (click)="onImageClick()"
      (keydown.enter)="onImageClick()"
    />

    <ng-template #previewTemplate>
      <div
        class="glint-image-preview-overlay"
        role="button"
        tabindex="0"
        (click)="onBackdropClick($event)"
        (keydown.escape)="closePreview()"
      >
        <button
          class="glint-image-preview-close"
          type="button"
          aria-label="Close preview"
          (click)="closePreview()"
        ><glint-icon name="x" /></button>
        <img
          class="glint-image-preview-img"
          [src]="src()"
          [alt]="alt()"
        />
      </div>
    </ng-template>
  `,
  styles: `
    :host {
      display: inline-block;
      line-height: 0;
    }

    img {
      display: block;
      max-inline-size: 100%;
      block-size: auto;
    }

    img.previewable {
      cursor: pointer;
      transition: opacity var(--glint-duration-fast, 150ms) var(--glint-easing-standard, ease);
    }
    img.previewable:hover {
      opacity: 0.85;
    }

    .glint-image-preview-overlay {
      position: fixed;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(0, 0, 0, 0.85);
      animation: glint-image-fade-in var(--glint-duration-normal, 200ms) var(--glint-easing-standard, ease);
      z-index: 1;
    }

    @keyframes glint-image-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .glint-image-preview-img {
      max-inline-size: 90vw;
      max-block-size: 90vh;
      object-fit: contain;
      border-radius: var(--glint-border-radius, 6px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
    }

    .glint-image-preview-close {
      position: absolute;
      inset-block-start: 1rem;
      inset-inline-end: 1rem;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      transition:
        background-color var(--glint-duration-fast, 150ms) var(--glint-easing-standard, ease);
      z-index: 2;
    }
    .glint-image-preview-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }
    .glint-image-preview-close:focus-visible {
      outline: 2px solid #fff;
      outline-offset: 2px;
    }
  `,
})
export class GlintImageComponent {
  /** Image source URL */
  src = input.required<string>();
  /** Alt text for the image */
  alt = input('');
  /** Inline size (width) of the image */
  width = input<string | null>(null);
  /** Block size (height) of the image */
  height = input<string | null>(null);
  /** Enable click-to-preview fullscreen overlay */
  preview = input(false);
  /** Additional CSS class(es) for the img element */
  imageClass = input('');

  private readonly overlay = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly vcr = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly previewTemplate = viewChild.required<TemplateRef<unknown>>('previewTemplate');

  private overlayRef: OverlayRef | null = null;
  private isPreviewOpen = signal(false);

  constructor() {
    this.destroyRef.onDestroy(() => this.closePreview());
  }

  onImageClick(): void {
    if (!this.preview()) return;
    this.openPreview();
  }

  openPreview(): void {
    if (this.isPreviewOpen()) return;

    const positionStrategy = this.overlay
      .position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const config = new OverlayConfig({
      positionStrategy,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      hasBackdrop: false, // We render our own backdrop in the template
      width: '100vw',
      height: '100vh',
    });

    const { overlayRef } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.previewTemplate(), this.vcr);
    overlayRef.attach(portal);

    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        this.closePreview();
      }
    });

    this.isPreviewOpen.set(true);
  }

  closePreview(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isPreviewOpen.set(false);
  }

  onBackdropClick(event: MouseEvent): void {
    // Close only if clicking the overlay backdrop, not the image itself
    if ((event.target as HTMLElement).classList.contains('glint-image-preview-overlay')) {
      this.closePreview();
    }
  }
}
