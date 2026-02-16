import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

let nextId = 0;

/**
 * Checkbox component with ControlValueAccessor and indeterminate state support.
 *
 * @example
 * ```html
 * <glint-checkbox [formControl]="agreeCtrl">I agree to the terms</glint-checkbox>
 * <glint-checkbox [indeterminate]="true">Select all</glint-checkbox>
 * ```
 */
@Component({
  selector: 'glint-checkbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.checked]': 'checked()',
    '[class.disabled]': 'isDisabled()',
    '[class.indeterminate]': 'indeterminate()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
      cursor: pointer;
      user-select: none;
    }

    :host(.disabled) {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    .box {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      border: 2px solid var(--glint-color-border);
      border-radius: calc(var(--glint-border-radius) * 0.5);
      background: var(--glint-color-surface);
      flex-shrink: 0;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.checked) .box,
    :host(.indeterminate) .box {
      background: var(--glint-color-primary);
      border-color: var(--glint-color-primary);
    }

    :host(:hover:not(.disabled)) .box {
      border-color: color-mix(in oklch, var(--glint-color-border), black 20%);
    }
    :host(.checked:hover:not(.disabled)) .box,
    :host(.indeterminate:hover:not(.disabled)) .box {
      background: color-mix(in oklch, var(--glint-color-primary), black 10%);
      border-color: color-mix(in oklch, var(--glint-color-primary), black 10%);
    }

    .box:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    .check {
      display: none;
      inline-size: 0.75rem;
      block-size: 0.75rem;
      color: var(--glint-color-primary-contrast);
    }

    :host(.checked) .check.checkmark,
    :host(.indeterminate) .check.dash {
      display: block;
    }

    input[type="checkbox"] {
      position: absolute;
      inline-size: 1px;
      block-size: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `,
  template: `
    <input
      #inputEl
      type="checkbox"
      [id]="inputId"
      [checked]="checked()"
      [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
      (change)="onToggle()"
    />
    <span
      class="box"
      tabindex="0"
      role="checkbox"
      [attr.aria-checked]="indeterminate() ? 'mixed' : checked()"
      [attr.aria-disabled]="isDisabled() || null"
      (click)="onToggle()"
      (keydown.space)="onToggle(); $event.preventDefault()"
    >
      <svg class="check checkmark" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 6L5 9L10 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <svg class="check dash" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H9" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </span>
    <label [attr.for]="inputId"><ng-content /></label>
  `,
})
export class GlintCheckboxComponent implements ControlValueAccessor {
  /** Disabled state */
  disabled = input(false);
  /** Indeterminate state (visual only, does not affect value) */
  indeterminate = input(false);

  readonly inputId = `glint-checkbox-${nextId++}`;

  protected checked = signal(false);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    effect(() => {
      const disabled = this.isDisabled();
      const el = this.inputRef()?.nativeElement;
      if (el) {
        el.disabled = disabled;
      }
    });
  }

  // ── ControlValueAccessor ─────────────────────
  writeValue(value: boolean | null): void {
    this.checked.set(!!value);
  }

  registerOnChange(fn: (value: boolean) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Event handlers ───────────────────────────
  protected onToggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
