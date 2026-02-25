import {
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChild,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
  TemplateRef,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * Data-driven content slider / carousel.
 *
 * Use a child `ng-template` with `#item` to define custom item rendering.
 *
 * @example
 * ```html
 * <glint-carousel [value]="products" [numVisible]="3" [numScroll]="1" [circular]="true">
 *   <ng-template #item let-product let-i="index">
 *     <div class="product-card">{{ product.name }}</div>
 *   </ng-template>
 * </glint-carousel>
 * ```
 */
@Component({
  selector: 'glint-carousel',
  standalone: true,
  imports: [NgTemplateOutlet, GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'glint-carousel',
    '[attr.data-orientation]': 'orientation()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .carousel-container {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      position: relative;
    }

    .carousel-container.vertical {
      flex-direction: column;
    }

    .carousel-viewport {
      overflow: hidden;
      flex: 1;
      min-inline-size: 0;
    }

    .carousel-container.vertical .carousel-viewport {
      min-block-size: 0;
    }

    .carousel-track {
      display: flex;
      transition: transform var(--glint-duration-normal, 200ms) var(--glint-easing, ease);
    }

    .carousel-container.vertical .carousel-track {
      flex-direction: column;
    }

    .carousel-item {
      flex-shrink: 0;
      box-sizing: border-box;
    }

    .nav-button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border: 1px solid var(--glint-color-border);
      border-radius: 50%;
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-size: 1rem;
      cursor: pointer;
      flex-shrink: 0;
      transition:
        background-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease),
        color var(--glint-duration-fast, 100ms) var(--glint-easing, ease),
        border-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
    }

    .nav-button:hover:not(:disabled) {
      background: var(--glint-color-surface-variant);
      border-color: var(--glint-color-primary);
      color: var(--glint-color-primary);
    }

    .nav-button:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }

    .nav-button:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .carousel-indicators {
      display: flex;
      justify-content: center;
      gap: var(--glint-spacing-xs);
      padding-block-start: var(--glint-spacing-sm);
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
  `,
  template: `
    <div class="carousel-container" [class.vertical]="orientation() === 'vertical'">
      @if (showNavigators()) {
        <button class="nav-button prev" (click)="prev()" [disabled]="!canGoPrev()" type="button" aria-label="Previous">
          <glint-icon name="chevronLeft" />
        </button>
      }
      <div class="carousel-viewport">
        <div class="carousel-track" [style.transform]="trackTransform()">
          @for (item of value(); track $index) {
            <div class="carousel-item" [style.flex]="itemFlex()">
              @if (itemTemplate()) {
                <ng-container [ngTemplateOutlet]="itemTemplate()!" [ngTemplateOutletContext]="{ $implicit: item, index: $index }" />
              }
            </div>
          }
        </div>
      </div>
      @if (showNavigators()) {
        <button class="nav-button next" (click)="next()" [disabled]="!canGoNext()" type="button" aria-label="Next">
          <glint-icon name="chevronRight" />
        </button>
      }
    </div>
    @if (showIndicators()) {
      <div class="carousel-indicators">
        @for (page of pages(); track $index) {
          <button
            class="indicator"
            [class.active]="$index === currentPage()"
            (click)="goToPage($index)"
            type="button"
            [attr.aria-label]="'Page ' + ($index + 1)"
          ></button>
        }
      </div>
    }
  `,
})
export class GlintCarouselComponent {
  /** Data items to display */
  readonly value = input.required<unknown[]>();
  /** Number of items visible at once */
  readonly numVisible = input(1);
  /** Number of items to scroll per step */
  readonly numScroll = input(1);
  /** Whether to wrap around at boundaries */
  readonly circular = input(false);
  /** Autoplay interval in ms (0 = disabled) */
  readonly autoplayInterval = input(0);
  /** Whether to show prev/next navigator buttons */
  readonly showNavigators = input(true);
  /** Whether to show page indicator dots */
  readonly showIndicators = input(true);
  /** Orientation */
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');

  /** Emitted when the current page changes */
  readonly pageChange = output<number>();

  /** Custom item template provided via `#item` */
  readonly itemTemplate = contentChild<TemplateRef<unknown>>('item');

  private readonly destroyRef = inject(DestroyRef);

  /** Current page index */
  readonly currentPage = signal(0);

  /** Total number of pages */
  readonly totalPages = computed(() => {
    const items = this.value();
    const visible = this.numVisible();
    const scroll = this.numScroll();
    if (!items.length || visible <= 0 || scroll <= 0) return 0;
    return Math.ceil((items.length - visible) / scroll) + 1;
  });

  /** Array used for indicator rendering */
  readonly pages = computed(() => {
    const total = this.totalPages();
    return Array.from({ length: total }, (_, i) => i);
  });

  /** Whether the previous button can be clicked */
  readonly canGoPrev = computed(() => {
    if (this.circular()) return true;
    return this.currentPage() > 0;
  });

  /** Whether the next button can be clicked */
  readonly canGoNext = computed(() => {
    if (this.circular()) return true;
    return this.currentPage() < this.totalPages() - 1;
  });

  /** CSS flex shorthand for each item */
  readonly itemFlex = computed(() => {
    return `0 0 ${100 / this.numVisible()}%`;
  });

  /** CSS transform for the track */
  readonly trackTransform = computed(() => {
    const page = this.currentPage();
    const scroll = this.numScroll();
    const visible = this.numVisible();
    const offset = page * scroll * (100 / visible);

    if (this.orientation() === 'vertical') {
      return `translateY(-${offset}%)`;
    }
    return `translateX(-${offset}%)`;
  });

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor() {
    // React to autoplayInterval input changes: start/stop timer as needed
    effect(() => {
      const interval = this.autoplayInterval();
      this.clearAutoplay();
      if (interval > 0) {
        this.autoplayTimer = setInterval(() => this.next(), interval);
      }
    });

    this.destroyRef.onDestroy(() => {
      this.clearAutoplay();
    });
  }

  /** Navigate to the next page */
  next(): void {
    const total = this.totalPages();
    if (total <= 0) return;

    const current = this.currentPage();
    if (current < total - 1) {
      this.goToPage(current + 1);
    } else if (this.circular()) {
      this.goToPage(0);
    }
  }

  /** Navigate to the previous page */
  prev(): void {
    const total = this.totalPages();
    if (total <= 0) return;

    const current = this.currentPage();
    if (current > 0) {
      this.goToPage(current - 1);
    } else if (this.circular()) {
      this.goToPage(total - 1);
    }
  }

  /** Navigate to a specific page */
  goToPage(page: number): void {
    const total = this.totalPages();
    if (page < 0 || page >= total) return;
    this.currentPage.set(page);
    this.pageChange.emit(page);
  }

  private clearAutoplay(): void {
    if (this.autoplayTimer !== null) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }
}
