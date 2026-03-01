import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/** Option shape for SelectButton */
export interface SelectButtonOption {
  label: string;
  value: unknown;
  disabled?: boolean;
}

/**
 * Horizontal button group for single or multi selection with CVA support.
 *
 * @example
 * ```html
 * <glint-select-button
 *   [options]="[
 *     { label: 'Left', value: 'left' },
 *     { label: 'Center', value: 'center' },
 *     { label: 'Right', value: 'right' }
 *   ]"
 *   [formControl]="alignCtrl"
 * />
 *
 * <glint-select-button
 *   [options]="sizes"
 *   [multiple]="true"
 *   [formControl]="sizeCtrl"
 * />
 * ```
 */
@Component({
  selector: 'glint-select-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      display: inline-flex;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    :host(.disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    .select-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: var(--glint-spacing-sm) var(--glint-spacing-lg);
      border: 1px solid var(--glint-color-border);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      cursor: pointer;
      user-select: none;
      margin-inline-start: -1px;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .select-btn:first-child {
      margin-inline-start: 0;
      border-start-start-radius: var(--glint-border-radius);
      border-end-start-radius: var(--glint-border-radius);
    }

    .select-btn:last-child {
      border-start-end-radius: var(--glint-border-radius);
      border-end-end-radius: var(--glint-border-radius);
    }

    .select-btn:hover:not(.selected):not(:disabled) {
      background: color-mix(in oklch, var(--glint-color-surface), var(--glint-color-primary) 8%);
    }

    .select-btn:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
      z-index: 1;
    }

    .select-btn.selected {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
      z-index: 1;
    }

    .select-btn.selected:hover {
      background: color-mix(in oklch, var(--glint-color-primary), black 10%);
    }

    .select-btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
  template: `
    @for (option of options(); track option.value) {
      <button
        type="button"
        class="select-btn"
        [class.selected]="isSelected(option)"
        [attr.aria-pressed]="isSelected(option)"
        [disabled]="isDisabled() || !!option.disabled"
        (click)="onSelect(option)"
      >{{ option.label }}</button>
    }
  `,
})
export class GlintSelectButtonComponent implements ControlValueAccessor {
  /** Array of option objects */
  options = input.required<SelectButtonOption[]>();
  /** Enable multi-select mode */
  multiple = input(false);
  /** Disabled state from template */
  disabled = input(false);

  /** Internal selected values */
  protected selectedValues = signal<unknown[]>([]);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: unknown) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ── ControlValueAccessor ─────────────────────

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.selectedValues.set(Array.isArray(value) ? value : []);
    } else {
      this.selectedValues.set(value != null ? [value] : []);
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Helpers ──────────────────────────────────

  isSelected(option: SelectButtonOption): boolean {
    return this.selectedValues().includes(option.value);
  }

  // ── Event handlers ───────────────────────────

  protected onSelect(option: SelectButtonOption): void {
    if (this.isDisabled() || option.disabled) return;

    const val = option.value;

    if (this.multiple()) {
      const current = this.selectedValues();
      const idx = current.indexOf(val);
      if (idx >= 0) {
        this.selectedValues.set(current.filter((_, i) => i !== idx));
      } else {
        this.selectedValues.set([...current, val]);
      }
      this.onChange(this.selectedValues());
    } else {
      this.selectedValues.set([val]);
      this.onChange(val);
    }
    this.onTouched();
  }
}
