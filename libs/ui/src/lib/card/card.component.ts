import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  input,
} from '@angular/core';

/**
 * Structural directive marking projected card header content.
 *
 * @example
 * ```html
 * <glint-card>
 *   <div glintCardHeader>Card Title</div>
 *   <p>Card body content</p>
 * </glint-card>
 * ```
 */
@Directive({
  selector: '[glintCardHeader]',
  standalone: true,
  host: { 'class': 'glint-card-header' },
})
export class GlintCardHeaderDirective {}

/**
 * Structural directive marking projected card footer content.
 *
 * @example
 * ```html
 * <glint-card>
 *   <p>Card body content</p>
 *   <div glintCardFooter>Footer actions</div>
 * </glint-card>
 * ```
 */
@Directive({
  selector: '[glintCardFooter]',
  standalone: true,
  host: { 'class': 'glint-card-footer' },
})
export class GlintCardFooterDirective {}

/**
 * Card container component with zone-aware styling and variant support.
 *
 * @example
 * ```html
 * <glint-card variant="elevated">
 *   <div glintCardHeader>Title</div>
 *   <p>Body content here</p>
 *   <div glintCardFooter>
 *     <glint-button>Action</glint-button>
 *   </div>
 * </glint-card>
 * ```
 */
@Component({
  selector: 'glint-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    'role': 'region',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      background: var(--glint-color-surface);
      border-radius: var(--glint-border-radius);
      overflow: hidden;
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    /* ── Flat variant (default) ─────────────────── */
    :host([data-variant="flat"]) {
      border: 1px solid var(--glint-color-border);
      box-shadow: none;
    }

    /* ── Elevated variant ───────────────────────── */
    :host([data-variant="elevated"]) {
      border: none;
      box-shadow: var(--glint-shadow);
    }

    /* ── Outlined variant ───────────────────────── */
    :host([data-variant="outlined"]) {
      border: 2px solid var(--glint-color-border);
      box-shadow: none;
    }

    /* ── Content areas ──────────────────────────── */
    ::ng-deep .glint-card-header {
      padding-block: var(--glint-spacing-md);
      padding-inline: var(--glint-spacing-lg);
      border-block-end: 1px solid var(--glint-color-border);
      font-weight: 600;
    }

    ::ng-deep .glint-card-footer {
      padding-block: var(--glint-spacing-md);
      padding-inline: var(--glint-spacing-lg);
      border-block-start: 1px solid var(--glint-color-border);
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
    }

    .body {
      padding: var(--glint-spacing-lg);
    }
  `,
  template: `
    <ng-content select="[glintCardHeader]" />
    <div class="body">
      <ng-content />
    </div>
    <ng-content select="[glintCardFooter]" />
  `,
})
export class GlintCardComponent {
  /** Visual variant */
  variant = input<'flat' | 'elevated' | 'outlined'>('flat');
}
