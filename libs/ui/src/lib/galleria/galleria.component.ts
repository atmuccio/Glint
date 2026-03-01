import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  Injector,
  input,
  output,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GlintIconComponent } from '../icon/icon.component';

/** Image item for the Galleria */
export interface GlintGalleriaImage {
  src: string;
  alt?: string;
  thumbnailSrc?: string;
}

/**
 * Image gallery with thumbnail strip, prev/next navigation,
 * optional indicators, and fullscreen mode via CDK overlay.
 *
 * @example
 * ```html
 * <glint-galleria
 *   [images]="photos"
 *   [showThumbnails]="true"
 *   [fullscreen]="true"
 *   thumbnailsPosition="bottom"
 * />
 * ```
 */
@Component({
  selector: 'glint-galleria',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'glint-galleria',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .galleria-container {
      display: flex;
      flex-direction: column;
      gap: var(--glint-spacing-sm);
    }

    .galleria-container.thumbnails-top {
      flex-direction: column-reverse;
    }

    .galleria-container.thumbnails-left {
      flex-direction: row-reverse;
    }

    .galleria-container.thumbnails-right {
      flex-direction: row;
    }

    .galleria-container.thumbnails-left,
    .galleria-container.thumbnails-right {
      align-items: stretch;
    }

    .galleria-main {
      position: relative;
      flex: 1;
      min-inline-size: 0;
      overflow: hidden;
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface-variant);
    }

    .main-image {
      display: block;
      inline-size: 100%;
      block-size: auto;
      object-fit: contain;
    }

    .nav {
      position: absolute;
      inset-block-start: 50%;
      transform: translateY(-50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border: none;
      border-radius: 50%;
      background: color-mix(in oklch, var(--glint-color-surface), transparent 20%);
      color: var(--glint-color-text);
      font-size: 1rem;
      cursor: pointer;
      z-index: 1;
      transition:
        background-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease),
        color var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
    }

    .nav:hover {
      background: var(--glint-color-surface);
      color: var(--glint-color-primary);
    }

    .nav:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .nav.prev {
      inset-inline-start: var(--glint-spacing-sm);
    }

    .nav.next {
      inset-inline-end: var(--glint-spacing-sm);
    }

    .fullscreen-btn {
      position: absolute;
      inset-block-start: var(--glint-spacing-sm);
      inset-inline-end: var(--glint-spacing-sm);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2rem;
      block-size: 2rem;
      border: none;
      border-radius: var(--glint-border-radius);
      background: color-mix(in oklch, var(--glint-color-surface), transparent 20%);
      color: var(--glint-color-text);
      font-size: 1rem;
      cursor: pointer;
      z-index: 1;
      transition: background-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
    }

    .fullscreen-btn:hover {
      background: var(--glint-color-surface);
    }

    .fullscreen-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .thumbnail-strip {
      display: flex;
      gap: var(--glint-spacing-xs);
      overflow: auto;
    }

    .galleria-container.thumbnails-left .thumbnail-strip,
    .galleria-container.thumbnails-right .thumbnail-strip {
      flex-direction: column;
      max-block-size: 100%;
    }

    .thumbnail {
      flex-shrink: 0;
      inline-size: 4rem;
      block-size: 3rem;
      border: 2px solid transparent;
      border-radius: var(--glint-border-radius);
      background: transparent;
      padding: 0;
      cursor: pointer;
      overflow: hidden;
      transition:
        border-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease),
        opacity var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
      opacity: 0.6;
    }

    .thumbnail:hover {
      opacity: 0.9;
    }

    .thumbnail:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .thumbnail.active {
      border-color: var(--glint-color-primary);
      opacity: 1;
    }

    .thumbnail img {
      inline-size: 100%;
      block-size: 100%;
      object-fit: cover;
      display: block;
    }

    .indicator-strip {
      display: flex;
      justify-content: center;
      gap: var(--glint-spacing-xs);
      padding-block-start: var(--glint-spacing-xs);
    }

    .indicator {
      inline-size: 0.75rem;
      block-size: 0.75rem;
      border-radius: 50%;
      border: 2px solid var(--glint-color-border);
      background: transparent;
      padding: 0;
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease),
        border-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
    }

    .indicator:hover {
      border-color: var(--glint-color-primary);
    }

    .indicator:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .indicator.active {
      background: var(--glint-color-primary);
      border-color: var(--glint-color-primary);
    }

    /* Fullscreen overlay styles */
    .galleria-fullscreen {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      inline-size: 100vw;
      block-size: 100vh;
      background: rgba(0, 0, 0, 0.9);
      color: #fff;
    }

    .galleria-fullscreen .galleria-main {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      inline-size: 100%;
      background: transparent;
    }

    .galleria-fullscreen .main-image {
      max-inline-size: 90vw;
      max-block-size: 80vh;
      inline-size: auto;
      block-size: auto;
      object-fit: contain;
    }

    .galleria-fullscreen .nav {
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
    }

    .galleria-fullscreen .nav:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .fullscreen-close {
      position: absolute;
      inset-block-start: var(--glint-spacing-md);
      inset-inline-end: var(--glint-spacing-md);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.15);
      color: #fff;
      font-size: 1.25rem;
      cursor: pointer;
      z-index: 2;
      transition: background-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
    }

    .fullscreen-close:hover {
      background: rgba(255, 255, 255, 0.3);
    }

    .fullscreen-close:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .galleria-fullscreen .thumbnail-strip {
      padding: var(--glint-spacing-sm);
    }

    .galleria-fullscreen .thumbnail {
      opacity: 0.7;
      border-color: transparent;
    }

    .galleria-fullscreen .thumbnail.active {
      border-color: #fff;
      opacity: 1;
    }

    .galleria-fullscreen .indicator {
      border-color: rgba(255, 255, 255, 0.5);
    }

    .galleria-fullscreen .indicator.active {
      background: #fff;
      border-color: #fff;
    }
  `,
  template: `
    <div class="galleria-container" [class]="'thumbnails-' + thumbnailsPosition()">
      <div class="galleria-main">
        @if (showNavigators() && images().length > 1) {
          <button class="nav prev" (click)="prev()" type="button" aria-label="Previous image"><glint-icon name="chevronLeft" /></button>
        }
        @if (activeImage(); as img) {
          <img [src]="img.src" [alt]="img.alt ?? ''" class="main-image" />
        }
        @if (showNavigators() && images().length > 1) {
          <button class="nav next" (click)="next()" type="button" aria-label="Next image"><glint-icon name="chevronRight" /></button>
        }
        @if (fullscreen()) {
          <button class="fullscreen-btn" (click)="openFullscreen()" type="button" aria-label="Fullscreen">&#x26F6;</button>
        }
      </div>
      @if (showThumbnails()) {
        <div class="thumbnail-strip">
          @for (img of images(); track $index) {
            <button
              class="thumbnail"
              [class.active]="$index === activeIndex()"
              (click)="goTo($index)"
              type="button"
              [attr.aria-label]="'Image ' + ($index + 1)"
            >
              <img [src]="img.thumbnailSrc ?? img.src" [alt]="img.alt ?? ''" />
            </button>
          }
        </div>
      }
      @if (showIndicators()) {
        <div class="indicator-strip">
          @for (img of images(); track $index) {
            <button class="indicator" [class.active]="$index === activeIndex()" (click)="goTo($index)" type="button" [attr.aria-label]="'Go to image ' + ($index + 1)"></button>
          }
        </div>
      }
    </div>

    <ng-template #fullscreenTemplate>
      <div class="galleria-fullscreen">
        <button class="fullscreen-close" (click)="closeFullscreen()" type="button" aria-label="Close fullscreen"><glint-icon name="x" /></button>
        <div class="galleria-main">
          @if (images().length > 1) {
            <button class="nav prev" (click)="prev()" type="button" aria-label="Previous image"><glint-icon name="chevronLeft" /></button>
          }
          @if (activeImage(); as img) {
            <img [src]="img.src" [alt]="img.alt ?? ''" class="main-image" />
          }
          @if (images().length > 1) {
            <button class="nav next" (click)="next()" type="button" aria-label="Next image"><glint-icon name="chevronRight" /></button>
          }
        </div>
        @if (showThumbnails()) {
          <div class="thumbnail-strip">
            @for (img of images(); track $index) {
              <button
                class="thumbnail"
                [class.active]="$index === activeIndex()"
                (click)="goTo($index)"
                type="button"
                [attr.aria-label]="'Image ' + ($index + 1)"
              >
                <img [src]="img.thumbnailSrc ?? img.src" [alt]="img.alt ?? ''" />
              </button>
            }
          </div>
        }
        @if (showIndicators()) {
          <div class="indicator-strip">
            @for (img of images(); track $index) {
              <button class="indicator" [class.active]="$index === activeIndex()" (click)="goTo($index)" type="button" [attr.aria-label]="'Go to image ' + ($index + 1)"></button>
            }
          </div>
        }
      </div>
    </ng-template>
  `,
})
export class GlintGalleriaComponent {
  /** Array of images */
  readonly images = input.required<GlintGalleriaImage[]>();
  /** Whether to show the thumbnail strip */
  readonly showThumbnails = input(true);
  /** Whether to show dot indicators */
  readonly showIndicators = input(false);
  /** Whether to show prev/next navigator buttons */
  readonly showNavigators = input(true);
  /** Whether to auto-advance images */
  readonly autoplay = input(false);
  /** Autoplay interval in milliseconds */
  readonly autoplayInterval = input(3000);
  /** Whether to wrap around at boundaries */
  readonly circular = input(false);
  /** Whether to show the fullscreen button */
  readonly fullscreen = input(false);
  /** Position of the thumbnail strip */
  readonly thumbnailsPosition = input<'bottom' | 'top' | 'left' | 'right'>('bottom');

  /** Emitted when the active image index changes */
  readonly activeIndexChange = output<number>();

  /** Active image index */
  readonly activeIndex = signal(0);

  /** The currently active image */
  readonly activeImage = computed(() => {
    const imgs = this.images();
    const idx = this.activeIndex();
    return imgs.length > 0 ? imgs[idx] : null;
  });

  private readonly overlay = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly vcr = inject(ViewContainerRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fullscreenTemplate = viewChild<TemplateRef<unknown>>('fullscreenTemplate');

  private overlayRef: OverlayRef | null = null;
  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // React to autoplay input changes: start/stop timer as needed
    effect(() => {
      const autoplay = this.autoplay();
      const interval = this.autoplayInterval();
      // Clear any existing timer before potentially starting a new one
      this.clearAutoplay();
      if (autoplay && interval > 0) {
        this.autoplayTimer = setInterval(() => this.next(), interval);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearAutoplay();
      this.disposeOverlay();
    });
  }

  /** Navigate to the next image */
  next(): void {
    const imgs = this.images();
    if (!imgs.length) return;
    const current = this.activeIndex();
    if (current < imgs.length - 1) {
      this.goTo(current + 1);
    } else if (this.circular()) {
      this.goTo(0);
    }
  }

  /** Navigate to the previous image */
  prev(): void {
    const imgs = this.images();
    if (!imgs.length) return;
    const current = this.activeIndex();
    if (current > 0) {
      this.goTo(current - 1);
    } else if (this.circular()) {
      this.goTo(imgs.length - 1);
    }
  }

  /** Navigate to a specific image index */
  goTo(index: number): void {
    const imgs = this.images();
    if (index < 0 || index >= imgs.length) return;
    this.activeIndex.set(index);
    this.activeIndexChange.emit(index);
  }

  /** Open fullscreen overlay */
  openFullscreen(): void {
    if (this.overlayRef) return;

    const config = new OverlayConfig({
      positionStrategy: this.overlay.position().global()
        .centerHorizontally()
        .centerVertically(),
      hasBackdrop: false,
      width: '100vw',
      height: '100vh',
    });

    const { overlayRef } = this.overlay.createZoneAwareOverlay(config, this.injector);
    this.overlayRef = overlayRef;

    const template = this.fullscreenTemplate();
    if (template) {
      const portal = new TemplatePortal(template, this.vcr);
      overlayRef.attach(portal);
    }

    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') this.closeFullscreen();
    });
  }

  /** Close fullscreen overlay */
  closeFullscreen(): void {
    this.disposeOverlay();
  }

  private clearAutoplay(): void {
    if (this.autoplayTimer !== null) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  private disposeOverlay(): void {
    if (this.overlayRef) {
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
  }
}
