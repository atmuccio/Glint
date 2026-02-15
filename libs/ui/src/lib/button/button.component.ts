import {
  ChangeDetectionStrategy,
  Component,
  computed,
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
 * ```
 */
@Component({
  selector: 'glint-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'resolvedVariant()',
    '[attr.data-severity]': 'severity()',
    '[attr.data-loading]': 'loading() || null',
    '[class.disabled]': 'disabled()',
  },
  styles: `
    :host {
      display: inline-flex;
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      font-weight: 500;
      line-height: 1.25;
      border: 1px solid transparent;
      border-radius: var(--glint-border-radius);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-lg);
      cursor: pointer;
      user-select: none;
      text-decoration: none;
      align-items: center;
      justify-content: center;
      gap: var(--glint-spacing-xs);
      outline: none;
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    :host(:focus-visible) {
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    :host(.disabled) {
      opacity: 0.5;
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
      background: color-mix(in oklch, var(--glint-color-primary), black 10%);
      border-color: color-mix(in oklch, var(--glint-color-primary), black 10%);
    }
    :host([data-variant="filled"][data-severity="primary"]:active:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-primary), black 20%);
    }

    :host([data-variant="filled"][data-severity="secondary"]) {
      background: var(--glint-color-secondary);
      color: var(--glint-color-secondary-contrast);
      border-color: var(--glint-color-secondary);
    }
    :host([data-variant="filled"][data-severity="secondary"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-secondary), black 10%);
    }

    :host([data-variant="filled"][data-severity="neutral"]) {
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      border-color: var(--glint-color-border);
    }
    :host([data-variant="filled"][data-severity="neutral"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), black 5%);
    }

    /* ── Outlined variant ───────────────────────── */
    :host([data-variant="outlined"]) {
      background: transparent;
      border-color: var(--glint-color-border);
      color: var(--glint-color-text);
    }
    :host([data-variant="outlined"][data-severity="primary"]) {
      border-color: var(--glint-color-primary);
      color: var(--glint-color-primary);
    }
    :host([data-variant="outlined"][data-severity="primary"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }
    :host([data-variant="outlined"][data-severity="secondary"]) {
      border-color: var(--glint-color-secondary);
      color: var(--glint-color-secondary);
    }
    :host([data-variant="outlined"][data-severity="secondary"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-secondary), transparent 90%);
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
    :host([data-variant="ghost"]:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-text), transparent 90%);
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
      animation: glint-spin 0.6s linear infinite;
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
      cursor: inherit;
      padding: 0;
      border: none;
      background: none;
      font: inherit;
      color: inherit;
    }
  `,
  template: `
    <button
      [type]="type()"
      [disabled]="disabled()"
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
  severity = input<'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'neutral'>('primary');
  /** Disabled state */
  disabled = input(false);
  /** Loading state — shows spinner, hides content, sets aria-busy */
  loading = input(false);
  /** Button type attribute */
  type = input<'button' | 'submit' | 'reset'>('button');

  private zone = inject(ZONE_THEME);
  private elRef = inject(ElementRef<HTMLElement>);

  /** FocusMonitor for keyboard focus tracking */
  private focusOrigin = toSignal(
    inject(FocusMonitor).monitor(this.elRef, true),
    { initialValue: null }
  );

  /** Resolved variant: uses zone default if not explicitly set */
  resolvedVariant = computed(() => this.variant() ?? this.zone().defaultVariant);
}
