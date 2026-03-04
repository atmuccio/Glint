import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { FocusMonitor } from '@angular/cdk/a11y';
import { toSignal } from '@angular/core/rxjs-interop';
import { ZONE_THEME } from '../core/tokens/zone-theme.token';

/**
 * Button component with zone-aware styling, severity levels, and loading state.
 *
 * @example
 * ```html
 * <glint-button severity="primary" variant="filled">Click me</glint-button>
 * <glint-button severity="danger" variant="outlined" [loading]="true">Saving...</glint-button>
 * <glint-button size="sm" [rounded]="true">Small Pill</glint-button>
 * <glint-button severity="info" [raised]="true">Elevated Info</glint-button>
 * ```
 */
@Component({
  selector: 'glint-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'resolvedVariant()',
    '[attr.data-severity]': 'severity()',
    '[attr.data-size]': 'size()',
    '[attr.data-loading]': 'loading() || null',
    '[attr.data-rounded]': 'rounded() || null',
    '[attr.data-raised]': 'raised() || null',
    '[class.disabled]': 'disabled()',
  },
  styles: `
    :host {
      display: inline-flex;
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      font-weight: var(--glint-font-weight);
      line-height: 1.25;
      border: 1px solid transparent;
      border-radius: var(--glint-border-radius);
      padding: 0;
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      align-items: center;
      justify-content: center;
      gap: var(--glint-spacing-sm);
      outline: none;
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    /* ── Sizes ─────────────────────────────────── */
    :host([data-size="sm"]) {
      font-size: 0.875rem;
      gap: var(--glint-spacing-xs);
    }

    :host([data-size="sm"]) button {
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
    }

    :host([data-size="lg"]) {
      font-size: 1.125rem;
    }

    :host([data-size="lg"]) button {
      padding-block: var(--glint-spacing-md);
      padding-inline: var(--glint-spacing-lg);
    }

    /* ── Rounded (pill) ────────────────────────── */
    :host([data-rounded]) {
      border-radius: 9999px;
    }

    /* ── Raised (elevated) ─────────────────────── */
    :host([data-raised]) {
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    }

    :host(:focus-visible) {
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    :host(.disabled) {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ── Filled variant ─────────────────────────── */
    :host([data-variant="filled"][data-severity="primary"]) {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
    }
    :host([data-variant="filled"][data-severity="primary"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
      border-color: color-mix(in oklch, var(--glint-color-primary), white 15%);
    }
    :host([data-variant="filled"][data-severity="primary"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-primary), white 30%);
      border-color: color-mix(in oklch, var(--glint-color-primary), white 30%);
    }

    :host([data-variant="filled"][data-severity="secondary"]) {
      background: var(--glint-color-secondary);
      color: var(--glint-color-secondary-contrast);
      border-color: var(--glint-color-secondary);
    }
    :host([data-variant="filled"][data-severity="secondary"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-secondary), black 5%);
      border-color: color-mix(in oklch, var(--glint-color-secondary), black 5%);
    }
    :host([data-variant="filled"][data-severity="secondary"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-secondary), black 12%);
      border-color: color-mix(in oklch, var(--glint-color-secondary), black 12%);
    }

    :host([data-variant="filled"][data-severity="success"]) {
      background: var(--glint-color-success);
      color: white;
      border-color: var(--glint-color-success);
    }
    :host([data-variant="filled"][data-severity="success"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-success), black 10%);
      border-color: color-mix(in oklch, var(--glint-color-success), black 10%);
    }
    :host([data-variant="filled"][data-severity="success"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-success), black 20%);
      border-color: color-mix(in oklch, var(--glint-color-success), black 20%);
    }

    :host([data-variant="filled"][data-severity="info"]) {
      background: var(--glint-color-info);
      color: white;
      border-color: var(--glint-color-info);
    }
    :host([data-variant="filled"][data-severity="info"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-info), black 10%);
      border-color: color-mix(in oklch, var(--glint-color-info), black 10%);
    }
    :host([data-variant="filled"][data-severity="info"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-info), black 20%);
      border-color: color-mix(in oklch, var(--glint-color-info), black 20%);
    }

    :host([data-variant="filled"][data-severity="warning"]) {
      background: var(--glint-color-warning);
      color: white;
      border-color: var(--glint-color-warning);
    }
    :host([data-variant="filled"][data-severity="warning"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-warning), black 10%);
      border-color: color-mix(in oklch, var(--glint-color-warning), black 10%);
    }
    :host([data-variant="filled"][data-severity="warning"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-warning), black 20%);
      border-color: color-mix(in oklch, var(--glint-color-warning), black 20%);
    }

    :host([data-variant="filled"][data-severity="danger"]) {
      background: var(--glint-color-error);
      color: white;
      border-color: var(--glint-color-error);
    }
    :host([data-variant="filled"][data-severity="danger"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-error), black 10%);
      border-color: color-mix(in oklch, var(--glint-color-error), black 10%);
    }
    :host([data-variant="filled"][data-severity="danger"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-error), black 20%);
      border-color: color-mix(in oklch, var(--glint-color-error), black 20%);
    }

    :host([data-variant="filled"][data-severity="neutral"]) {
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      border-color: var(--glint-color-border);
    }
    :host([data-variant="filled"][data-severity="neutral"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), black 5%);
    }
    :host([data-variant="filled"][data-severity="neutral"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), black 12%);
    }

    /* ── Outlined variant ───────────────────────── */
    :host([data-variant="outlined"]) {
      background: transparent;
      border-color: var(--glint-color-border);
      color: var(--glint-color-text);
    }
    :host([data-variant="outlined"][data-severity="primary"]) {
      border-color: var(--glint-color-border);
      color: var(--glint-color-primary);
    }
    :host([data-variant="outlined"][data-severity="primary"]:hover:not(.disabled)) {
      background: var(--glint-color-surface-variant);
    }
    :host([data-variant="outlined"][data-severity="primary"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 15%);
    }
    :host([data-variant="outlined"][data-severity="secondary"]) {
      border-color: var(--glint-color-border);
      color: var(--glint-color-secondary-contrast);
    }
    :host([data-variant="outlined"][data-severity="secondary"]:hover:not(.disabled)) {
      background: var(--glint-color-surface-variant);
    }
    :host([data-variant="outlined"][data-severity="secondary"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 15%);
    }
    :host([data-variant="outlined"][data-severity="success"]) {
      border-color: var(--glint-color-success);
      color: var(--glint-color-success);
    }
    :host([data-variant="outlined"][data-severity="success"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-success), white 90%);
    }
    :host([data-variant="outlined"][data-severity="success"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-success), white 80%);
    }
    :host([data-variant="outlined"][data-severity="info"]) {
      border-color: var(--glint-color-info);
      color: var(--glint-color-info);
    }
    :host([data-variant="outlined"][data-severity="info"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-info), white 90%);
    }
    :host([data-variant="outlined"][data-severity="info"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-info), white 80%);
    }
    :host([data-variant="outlined"][data-severity="warning"]) {
      border-color: var(--glint-color-warning);
      color: var(--glint-color-warning);
    }
    :host([data-variant="outlined"][data-severity="warning"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-warning), white 90%);
    }
    :host([data-variant="outlined"][data-severity="warning"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-warning), white 80%);
    }
    :host([data-variant="outlined"][data-severity="danger"]) {
      border-color: var(--glint-color-error);
      color: var(--glint-color-error);
    }
    :host([data-variant="outlined"][data-severity="danger"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-error), white 90%);
    }
    :host([data-variant="outlined"][data-severity="danger"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-error), white 80%);
    }
    :host([data-variant="outlined"][data-severity="neutral"]) {
      border-color: var(--glint-color-border);
      color: var(--glint-color-text);
    }
    :host([data-variant="outlined"][data-severity="neutral"]:hover:not(.disabled)) {
      background: var(--glint-color-surface-variant);
    }
    :host([data-variant="outlined"][data-severity="neutral"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 15%);
    }

    /* ── Ghost variant ──────────────────────────── */
    :host([data-variant="ghost"]) {
      background: transparent;
      border-color: transparent;
      color: var(--glint-color-text);
    }
    :host([data-variant="ghost"][data-severity="primary"]) {
      color: var(--glint-color-primary);
    }
    :host([data-variant="ghost"][data-severity="success"]) {
      color: var(--glint-color-success);
    }
    :host([data-variant="ghost"][data-severity="info"]) {
      color: var(--glint-color-info);
    }
    :host([data-variant="ghost"][data-severity="warning"]) {
      color: var(--glint-color-warning);
    }
    :host([data-variant="ghost"][data-severity="danger"]) {
      color: var(--glint-color-error);
    }
    :host([data-variant="ghost"]:hover:not(.disabled)) {
      background: var(--glint-color-surface-variant);
    }
    :host([data-variant="ghost"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), var(--glint-color-border) 15%);
    }
    :host([data-variant="ghost"][data-severity="success"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-success), white 90%);
    }
    :host([data-variant="ghost"][data-severity="success"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-success), white 80%);
    }
    :host([data-variant="ghost"][data-severity="info"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-info), white 90%);
    }
    :host([data-variant="ghost"][data-severity="info"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-info), white 80%);
    }
    :host([data-variant="ghost"][data-severity="warning"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-warning), white 90%);
    }
    :host([data-variant="ghost"][data-severity="warning"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-warning), white 80%);
    }
    :host([data-variant="ghost"][data-severity="danger"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-error), white 90%);
    }
    :host([data-variant="ghost"][data-severity="danger"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-error), white 80%);
    }

    .content {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
    }

    /* ── Loading state ──────────────────────────── */
    :host([data-loading]) .content {
      visibility: hidden;
    }

    .spinner {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .spinner::after {
      content: '';
      display: block;
      inline-size: 1em;
      block-size: 1em;
      border: 2px solid currentColor;
      border-inline-end-color: transparent;
      border-radius: 50%;
      animation: glint-spin var(--glint-duration-slow) linear infinite;
    }

    @keyframes glint-spin {
      to { transform: rotate(360deg); }
    }

    /* ── Native button reset ────────────────────── */
    button {
      all: inherit;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      width: 100%;
      border: none;
      background: none;
    }
  `,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
      [attr.aria-label]="ariaLabel() || null"
      [attr.aria-busy]="loading() || null"
    >
      @if (loading()) {
        <span class="spinner" aria-hidden="true"></span>
      }
      <span class="content"><ng-content /></span>
    </button>
  `,
})
export class GlintButtonComponent {
  /** Visual variant */
  variant = input<'filled' | 'outlined' | 'ghost' | undefined>(undefined);
  /** Color severity */
  severity = input<'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' | 'neutral'>('primary');
  /** Size */
  size = input<'sm' | 'md' | 'lg'>('md');
  /** Disabled state */
  disabled = input(false);
  /** Loading state — shows spinner, hides content, sets aria-busy */
  loading = input(false);
  /** Button type attribute */
  type = input<'button' | 'submit' | 'reset'>('button');
  /** Pill shape (border-radius: 9999px) */
  rounded = input(false);
  /** Elevated shadow */
  raised = input(false);
  /** Accessible label for icon-only buttons */
  ariaLabel = input<string>('');

  private zone = inject(ZONE_THEME);
  private elRef = inject(ElementRef<HTMLElement>);
  private focusMonitor = inject(FocusMonitor);

  /** FocusMonitor for keyboard focus tracking */
  private focusOrigin = toSignal(
    this.focusMonitor.monitor(this.elRef, true),
    { initialValue: null }
  );

  /** Resolved variant: uses zone default if not explicitly set */
  resolvedVariant = computed(() => this.variant() ?? this.zone().defaultVariant);

  constructor() {
    inject(DestroyRef).onDestroy(() => this.focusMonitor.stopMonitoring(this.elRef));
  }
}
