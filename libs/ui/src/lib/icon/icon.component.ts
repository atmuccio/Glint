import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  isDevMode,
} from '@angular/core';
import { GLINT_ICON_REGISTRY } from './icon.registry';
import { GLINT_ICON_CONFIG } from './icon.config';

/**
 * Library-agnostic SVG icon renderer.
 *
 * Looks up icons by `name` in the hierarchical `GLINT_ICON_REGISTRY`,
 * or renders a raw SVG string passed via the `svg` input.
 *
 * Sizing is controlled by `--glint-icon-size` (defaults to `1em`)
 * and inherits `currentColor` for seamless theme integration.
 *
 * @example
 * ```html
 * <!-- By registered name -->
 * <glint-icon name="check" />
 *
 * <!-- With raw SVG -->
 * <glint-icon [svg]="mySvgString" label="Custom icon" />
 * ```
 */
@Component({
  selector: 'glint-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'img',
    '[attr.aria-hidden]': '!label() ? "true" : null',
    '[attr.aria-label]': 'label() || null',
    '[style.--glint-icon-size]': 'resolvedSize()',
    '[style.--glint-icon-stroke-width]': 'resolvedStrokeWidth()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: var(--glint-icon-size, 1em);
      block-size: var(--glint-icon-size, 1em);
      color: currentColor;
      flex-shrink: 0;
      vertical-align: middle;
    }
  `,
  template: '',
})
export class GlintIconComponent {
  /** Direct SVG string — bypasses the registry. */
  readonly svg = input<string>();

  /** Icon name — looked up in `GLINT_ICON_REGISTRY`. */
  readonly name = input<string>();

  /** Accessible label. Omit for decorative icons (sets `aria-hidden="true"`). */
  readonly label = input<string>();

  /** CSS size value override (e.g. `'1.5rem'`). */
  readonly size = input<string>();

  /** Stroke width override for stroke-based icons. */
  readonly strokeWidth = input<string | number>();

  private readonly config = inject(GLINT_ICON_CONFIG, { optional: true });
  private readonly registrySets = inject(GLINT_ICON_REGISTRY, {
    optional: true,
  });

  private readonly icons = computed(
    () =>
      this.registrySets?.reduce((acc, set) => ({ ...acc, ...set }), {}) ?? {},
  );

  protected readonly resolvedSize = computed(
    () => this.size() || this.config?.size || undefined,
  );

  protected readonly resolvedStrokeWidth = computed(
    () => this.strokeWidth() || this.config?.strokeWidth || undefined,
  );

  constructor() {
    const el = inject(ElementRef<HTMLElement>).nativeElement;

    afterRenderEffect({
      write: () => {
        const resolved =
          this.svg() ?? this.icons()[this.name() ?? ''] ?? null;

        if (!resolved && this.name() && isDevMode()) {
          console.warn(
            `glint-icon: "${this.name()}" not found in registry`,
          );
        }

        el.innerHTML = resolved ?? '';
      },
    });
  }
}
