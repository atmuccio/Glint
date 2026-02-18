import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  untracked,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { glintId } from '../core/utils/id-generator';

/**
 * Numeric input with spinner buttons, min/max/step, and ControlValueAccessor support.
 *
 * @example
 * ```html
 * <glint-input-number label="Quantity" [min]="0" [max]="100" [step]="1" [formControl]="qtyCtrl" />
 * <glint-input-number label="Price" [step]="0.01" prefix="$" />
 * ```
 */
@Component({
  selector: 'glint-input-number',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class.focused]': 'focused()',
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .label {
      display: block;
      margin-block-end: var(--glint-spacing-xs);
      font-weight: 500;
      color: var(--glint-color-text);
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      border-radius: var(--glint-border-radius);
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    :host([data-variant="outline"]) .input-wrapper {
      border: 1px solid var(--glint-color-border);
      background: var(--glint-color-surface);
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
    :host([data-variant="outline"].focused) .input-wrapper {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    :host([data-variant="filled"]) .input-wrapper {
      border: 1px solid transparent;
      border-block-end: 2px solid var(--glint-color-border);
      background: var(--glint-color-surface-variant);
      border-radius: var(--glint-border-radius) var(--glint-border-radius) 0 0;
    }
    :host([data-variant="filled"].focused) .input-wrapper {
      border-block-end-color: var(--glint-color-primary);
    }

    .prefix, .suffix {
      color: var(--glint-color-text-muted);
      padding-inline: var(--glint-spacing-xs);
      flex-shrink: 0;
      user-select: none;
    }

    input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font: inherit;
      color: var(--glint-color-text);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      min-inline-size: 0;
      text-align: start;
      -moz-appearance: textfield;
    }
    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    :host(.disabled) input {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spinner {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
    }

    .spinner-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      padding: 0;
      inline-size: 1.75rem;
      block-size: 1rem;
      transition: color var(--glint-duration-fast) var(--glint-easing);
    }
    .spinner-btn:hover:not(:disabled) {
      color: var(--glint-color-text);
    }
    .spinner-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .spinner-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .spinner-btn svg {
      inline-size: 0.625rem;
      block-size: 0.625rem;
    }

    /* ── Sizes ─────────────────────────────────── */
    :host([data-size="sm"]) {
      font-size: 0.875rem;
    }
    :host([data-size="sm"]) input {
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-sm);
    }
    :host([data-size="sm"]) .spinner-btn {
      inline-size: 1.5rem;
      block-size: 0.75rem;
    }

    :host([data-size="lg"]) {
      font-size: 1.125rem;
    }
    :host([data-size="lg"]) input {
      padding-block: var(--glint-spacing-md);
      padding-inline: var(--glint-spacing-lg);
    }
    :host([data-size="lg"]) .spinner-btn {
      inline-size: 2rem;
      block-size: 1.25rem;
    }
  `,
  template: `
    @if (label()) {
      <label class="label" [attr.for]="inputId">{{ label() }}</label>
    }
    <div class="input-wrapper">
      @if (prefix()) {
        <span class="prefix">{{ prefix() }}</span>
      }
      <input
        #inputEl
        [id]="inputId"
        type="text"
        inputmode="decimal"
        [placeholder]="placeholder()"
        [attr.aria-label]="label() || null"
        [attr.aria-valuemin]="min() ?? null"
        [attr.aria-valuemax]="max() ?? null"
        [attr.aria-valuenow]="value()"
        role="spinbutton"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />
      @if (suffix()) {
        <span class="suffix">{{ suffix() }}</span>
      }
      @if (showButtons()) {
        <span class="spinner">
          <button
            class="spinner-btn"
            type="button"
            tabindex="-1"
            aria-label="Increment"
            [disabled]="isDisabled() || isAtMax()"
            (mousedown)="onIncrement($event)"
          >
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7L5 3L8 7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          <button
            class="spinner-btn"
            type="button"
            tabindex="-1"
            aria-label="Decrement"
            [disabled]="isDisabled() || isAtMin()"
            (mousedown)="onDecrement($event)"
          >
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 3L5 7L8 3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </span>
      }
    </div>
  `,
})
export class GlintInputNumberComponent implements ControlValueAccessor {
  /** Input variant */
  variant = input<'outline' | 'filled'>('outline');
  /** Size */
  size = input<'sm' | 'md' | 'lg'>('md');
  /** Label text */
  label = input('');
  /** Placeholder text */
  placeholder = input('');
  /** Minimum value */
  min = input<number | null>(null);
  /** Maximum value */
  max = input<number | null>(null);
  /** Step increment */
  step = input(1);
  /** Show spinner buttons */
  showButtons = input(true);
  /** Prefix text (e.g. "$") */
  prefix = input('');
  /** Suffix text (e.g. "%") */
  suffix = input('');
  /** Disabled state */
  disabled = input<boolean | undefined>(undefined);

  readonly inputId = glintId('glint-input-number');

  protected value = signal<number | null>(null);
  protected focused = signal(false);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() === true || this.disabledFromCVA());

  isAtMin = computed(() => {
    const v = this.value();
    const m = this.min();
    return v !== null && m !== null && v <= m;
  });

  isAtMax = computed(() => {
    const v = this.value();
    const m = this.max();
    return v !== null && m !== null && v >= m;
  });

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: number | null) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      const disabled = this.disabled();
      untracked(() => {
        queueMicrotask(() => {
          const control = this.ngControl?.control;
          if (control && disabled !== undefined) {
            if (disabled && !control.disabled) {
              control.disable({ emitEvent: false });
            } else if (!disabled && control.disabled) {
              control.enable({ emitEvent: false });
            }
          }
        });
      });
    });

    afterRenderEffect({
      write: () => {
        const disabled = this.isDisabled();
        const el = this.inputRef()?.nativeElement;
        if (el) {
          el.disabled = disabled;
        }
      },
    });
  }

  // ── ControlValueAccessor ─────────────────────
  writeValue(value: number | null): void {
    this.value.set(value);
    const el = this.inputRef()?.nativeElement;
    if (el) {
      el.value = value != null ? String(value) : '';
    }
  }

  registerOnChange(fn: (value: number | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Event handlers ───────────────────────────
  protected onInput(event: Event): void {
    const raw = (event.target as HTMLInputElement).value;
    if (raw === '' || raw === '-') {
      this.value.set(null);
      this.onChange(null);
      return;
    }
    const parsed = parseFloat(raw);
    if (!isNaN(parsed)) {
      this.value.set(parsed);
      this.onChange(parsed);
    }
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.stepBy(this.step());
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.stepBy(-this.step());
    }
  }

  protected onIncrement(event: MouseEvent): void {
    event.preventDefault();
    this.stepBy(this.step());
  }

  protected onDecrement(event: MouseEvent): void {
    event.preventDefault();
    this.stepBy(-this.step());
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  private stepBy(delta: number): void {
    if (this.isDisabled()) return;
    const current = this.value() ?? 0;
    const next = this.clamp(this.round(current + delta));
    this.value.set(next);
    this.onChange(next);
    this.syncInputElement(next);
  }

  private clamp(v: number): number {
    const min = this.min();
    const max = this.max();
    if (min !== null && v < min) return min;
    if (max !== null && v > max) return max;
    return v;
  }

  /** Round to avoid floating-point precision issues with the step value */
  private round(v: number): number {
    const step = this.step();
    const decimals = (String(step).split('.')[1] || '').length;
    return decimals > 0 ? parseFloat(v.toFixed(decimals)) : v;
  }

  private syncInputElement(value: number): void {
    const el = this.inputRef()?.nativeElement;
    if (el) {
      el.value = String(value);
    }
  }
}
