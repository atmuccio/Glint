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
 * Radio button component with ControlValueAccessor and group support.
 *
 * @example
 * ```html
 * <glint-radio-button [value]="'a'" [formControl]="ctrl">Option A</glint-radio-button>
 * <glint-radio-button [value]="'b'" [formControl]="ctrl">Option B</glint-radio-button>
 * ```
 */
@Component({
  selector: 'glint-radio-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.checked]': 'isChecked()',
    '[class.disabled]': 'isDisabled()',
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

    .radio {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1.25rem;
      block-size: 1.25rem;
      border: 2px solid var(--glint-color-border);
      border-radius: 50%;
      background: var(--glint-color-surface);
      flex-shrink: 0;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        border-color var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.checked) .radio {
      border-color: var(--glint-color-primary);
    }

    :host(:hover:not(.disabled)) .radio {
      border-color: color-mix(in oklch, var(--glint-color-border), black 20%);
    }
    :host(.checked:hover:not(.disabled)) .radio {
      border-color: color-mix(in oklch, var(--glint-color-primary), black 10%);
    }

    .radio:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    .dot {
      inline-size: 0.625rem;
      block-size: 0.625rem;
      border-radius: 50%;
      background: var(--glint-color-primary);
      transform: scale(0);
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.checked) .dot {
      transform: scale(1);
    }

    input[type="radio"] {
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
      type="radio"
      [id]="inputId"
      [value]="value()"
      [name]="name()"
      [checked]="isChecked()"
      (change)="onSelect()"
    />
    <span
      class="radio"
      tabindex="0"
      role="radio"
      [attr.aria-checked]="isChecked()"
      [attr.aria-disabled]="isDisabled() || null"
      (click)="onSelect()"
      (keydown.space)="onSelect(); $event.preventDefault()"
    >
      <span class="dot"></span>
    </span>
    <label [attr.for]="inputId"><ng-content /></label>
  `,
})
export class GlintRadioButtonComponent implements ControlValueAccessor {
  /** The value this radio represents */
  value = input.required<unknown>();
  /** Radio group name (for native radio grouping) */
  name = input('');
  /** Disabled state */
  disabled = input(false);

  readonly inputId = `glint-radio-${nextId++}`;

  /** Internal model value (the group's selected value) */
  private modelValue = signal<unknown>(null);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());
  isChecked = computed(() => this.modelValue() === this.value());

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: unknown) => void = () => {};
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

  writeValue(value: unknown): void {
    this.modelValue.set(value);
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

  protected onSelect(): void {
    if (this.isDisabled() || this.isChecked()) return;
    const val = this.value();
    this.modelValue.set(val);
    this.onChange(val);
    this.onTouched();
  }
}
