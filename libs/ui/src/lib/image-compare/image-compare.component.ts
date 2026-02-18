import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';

/**
 * Before/after image comparison slider.
 *
 * Displays two images overlaid with a draggable divider that controls
 * how much of each image is visible.
 *
 * @example
 * ```html
 * <glint-image-compare
 *   leftSrc="/before.jpg"
 *   rightSrc="/after.jpg"
 *   leftAlt="Before"
 *   rightAlt="After"
 *   [initialPosition]="50"
 * />
 * ```
 */
@Component({
  selector: 'glint-image-compare',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'glint-image-compare',
  },
  template: `
    <div
      class="compare-container"
      (pointermove)="onPointerMove($event)"
      (pointerup)="onPointerUp()"
    >
      <img [src]="rightSrc()" [alt]="rightAlt()" class="compare-image right" />
      <img
        [src]="leftSrc()"
        [alt]="leftAlt()"
        class="compare-image left"
        [style.clip-path]="clipPath()"
      />
      <div
        class="compare-handle"
        [style.inset-inline-start.%]="position()"
        role="slider"
        tabindex="0"
        [attr.aria-valuenow]="position()"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Image comparison slider"
        (pointerdown)="onPointerDown($event)"
        (keydown)="onKeydown($event)"
      >
        <div class="handle-line"></div>
        <div class="handle-circle">&#8596;</div>
        <div class="handle-line"></div>
      </div>
    </div>
  `,
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
    }

    .compare-container {
      position: relative;
      overflow: hidden;
      line-height: 0;
      touch-action: none;
      user-select: none;
      border-radius: var(--glint-border-radius, 6px);
    }

    .compare-image {
      display: block;
      inline-size: 100%;
      block-size: auto;
    }

    .compare-image.left {
      position: absolute;
      inset: 0;
      block-size: 100%;
      object-fit: cover;
    }

    .compare-image.right {
      inline-size: 100%;
      block-size: auto;
      object-fit: cover;
    }

    .compare-handle {
      position: absolute;
      inset-block: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      transform: translateX(-50%);
      cursor: ew-resize;
      z-index: 1;
      outline: none;
    }

    .compare-handle:focus-visible .handle-circle {
      outline: 2px solid var(--glint-color-focus-ring, #3b82f6);
      outline-offset: 2px;
    }

    .handle-line {
      flex: 1;
      inline-size: 2px;
      background: #fff;
      box-shadow: 0 0 4px rgba(0, 0, 0, 0.4);
    }

    .handle-circle {
      display: flex;
      align-items: center;
      justify-content: center;
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border-radius: 50%;
      background: #fff;
      color: var(--glint-color-text, #1f2937);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      font-size: 1.25rem;
      font-weight: 600;
      flex-shrink: 0;
    }
  `,
})
export class GlintImageCompareComponent implements OnInit {
  /** Source URL for the left (before) image */
  leftSrc = input.required<string>();
  /** Source URL for the right (after) image */
  rightSrc = input.required<string>();
  /** Alt text for the left image */
  leftAlt = input('Before');
  /** Alt text for the right image */
  rightAlt = input('After');
  /** Initial slider position as percentage (0-100) */
  initialPosition = input(50);

  private readonly elRef = inject(ElementRef);

  /** Current slider position (percentage) */
  position = signal(50);

  /** Clip path for the left image */
  protected clipPath = computed(() => `inset(0 ${100 - this.position()}% 0 0)`);

  private dragging = false;

  ngOnInit(): void {
    this.position.set(this.initialPosition());
  }

  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    event.preventDefault();
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.dragging) return;
    this.updatePosition(event);
  }

  onPointerUp(): void {
    this.dragging = false;
  }

  onKeydown(event: KeyboardEvent): void {
    const current = this.position();
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.position.set(Math.max(0, current - 1));
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.position.set(Math.min(100, current + 1));
    }
  }

  private updatePosition(event: PointerEvent): void {
    const container = this.elRef.nativeElement.querySelector('.compare-container') as HTMLElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    this.position.set(Math.round(pct));
  }
}
