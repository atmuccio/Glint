import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';

/**
 * Floating action button that appears after the user scrolls past a threshold.
 * Clicking the button smoothly scrolls the page (or a target container) back to the top.
 *
 * @example
 * ```html
 * <glint-scroll-top />
 * <glint-scroll-top [threshold]="200" behavior="instant" />
 * <glint-scroll-top target=".scrollable-container" />
 * ```
 */
@Component({
  selector: 'glint-scroll-top',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.position]': '"fixed"',
    '[style.inset-block-end]': '"2rem"',
    '[style.inset-inline-end]': '"2rem"',
    '[style.z-index]': '"1000"',
    '[style.pointer-events]': 'visible() ? "auto" : "none"',
  },
  styles: `
    :host {
      display: block;
    }

    .scroll-top-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 3rem;
      block-size: 3rem;
      border-radius: 50%;
      border: none;
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      font-size: 1.25rem;
      cursor: pointer;
      box-shadow: 0 4px 12px rgb(0 0 0 / 0.15);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        opacity var(--glint-duration-normal) var(--glint-easing),
        transform var(--glint-duration-normal) var(--glint-easing);
    }

    .scroll-top-btn:hover {
      background: color-mix(in oklch, var(--glint-color-primary), black 15%);
    }

    .scroll-top-btn:active {
      background: color-mix(in oklch, var(--glint-color-primary), black 25%);
      transform: scale(0.95);
    }

    .scroll-top-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 2px;
    }
  `,
  template: `
    @if (visible()) {
      <button
        class="scroll-top-btn"
        (click)="scrollToTop()"
        aria-label="Scroll to top"
        type="button"
      >&#9650;</button>
    }
  `,
})
export class GlintScrollTopComponent {
  /** Scroll distance in pixels before the button appears. */
  threshold = input(400);

  /** Scroll behavior when returning to top. */
  behavior = input<ScrollBehavior>('smooth');

  /** CSS selector of the scroll container. Uses window if not set. */
  target = input<string | undefined>(undefined);

  /** Whether the scroll-to-top button is currently visible. */
  visible = signal(false);

  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      this.setupScrollListener();
    });
  }

  /** Scrolls the target (or window) back to the top. */
  scrollToTop(): void {
    const el = this.resolveTarget();
    if (el) {
      el.scrollTo({ top: 0, behavior: this.behavior() });
    } else {
      window.scrollTo({ top: 0, behavior: this.behavior() });
    }
  }

  private setupScrollListener(): void {
    const el = this.resolveTarget();
    const scrollTarget: EventTarget = el ?? window;

    const handler = () => {
      const scrollPos = el ? el.scrollTop : window.scrollY;
      this.visible.set(scrollPos >= this.threshold());
    };

    scrollTarget.addEventListener('scroll', handler, { passive: true });

    this.destroyRef.onDestroy(() => {
      scrollTarget.removeEventListener('scroll', handler);
    });
  }

  private resolveTarget(): Element | null {
    const sel = this.target();
    return sel ? document.querySelector(sel) : null;
  }
}
