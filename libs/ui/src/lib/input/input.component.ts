import {
  ChangeDetectionStrategy,
  Component,
  computed,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

let nextId = 0;

/**
 * Input component with ControlValueAccessor, zone-aware styling, and validation support.
 *
 * @example
 * ```html
 * <glint-input label="Email" placeholder="you@example.com" [formControl]="emailCtrl" />
 * <glint-input label="Name" variant="filled" [required]="true" />
 * ```
 */
@Component({
  selector: 'glint-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[class.focused]': 'focused()',
    '[class.disabled]': 'isDisabled()',
    '[class.invalid]': 'invalid()',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => GlintInputComponent),
      multi: true,
    },
  ],
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
      transition: color var(--glint-duration-normal) var(--glint-easing);
    }

    :host(.invalid) .label {
      color: color-mix(in oklch, var(--glint-color-text), red 40%);
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      border-radius: var(--glint-border-radius);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    /* ── Outline variant (default) ─────────────── */
    :host([data-variant="outline"]) .input-wrapper {
      border: 1px solid var(--glint-color-border);
      background: var(--glint-color-surface);
      padding-inline: var(--glint-spacing-md);
    }
    :host([data-variant="outline"].focused) .input-wrapper {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }
    :host([data-variant="outline"].invalid) .input-wrapper {
      border-color: red;
    }

    /* ── Filled variant ────────────────────────── */
    :host([data-variant="filled"]) .input-wrapper {
      border: 1px solid transparent;
      border-block-end: 2px solid var(--glint-color-border);
      background: var(--glint-color-surface-variant);
      padding-inline: var(--glint-spacing-md);
      border-radius: var(--glint-border-radius) var(--glint-border-radius) 0 0;
    }
    :host([data-variant="filled"].focused) .input-wrapper {
      border-block-end-color: var(--glint-color-primary);
    }

    /* ── Underline variant ─────────────────────── */
    :host([data-variant="underline"]) .input-wrapper {
      border: none;
      border-block-end: 1px solid var(--glint-color-border);
      border-radius: 0;
      background: transparent;
    }
    :host([data-variant="underline"].focused) .input-wrapper {
      border-block-end: 2px solid var(--glint-color-primary);
    }

    /* ── Input element ─────────────────────────── */
    input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font: inherit;
      color: var(--glint-color-text);
      padding-block: var(--glint-spacing-sm);
      min-inline-size: 0;
    }

    input::placeholder {
      color: var(--glint-color-text-muted);
    }

    :host(.disabled) input {
      opacity: 0.5;
      cursor: not-allowed;
    }

    /* ── Error message ─────────────────────────── */
    .error {
      margin-block-start: var(--glint-spacing-xs);
      font-size: 0.875em;
      color: red;
    }
  `,
  template: `
    @if (label()) {
      <label class="label" [attr.for]="inputId">{{ label() }}</label>
    }
    <div class="input-wrapper">
      <ng-content select="[glintPrefix]" />
      <input
        [id]="inputId"
        [type]="type()"
        [placeholder]="placeholder()"
        [disabled]="isDisabled()"
        [required]="required()"
        [value]="value()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-describedby]="invalid() && errorMessage() ? errorId : null"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      />
      <ng-content select="[glintSuffix]" />
    </div>
    @if (invalid() && errorMessage()) {
      <div class="error" [id]="errorId" role="alert">{{ errorMessage() }}</div>
    }
  `,
})
export class GlintInputComponent implements ControlValueAccessor {
  /** Input variant */
  variant = input<'outline' | 'filled' | 'underline'>('outline');
  /** Label text */
  label = input<string>('');
  /** Placeholder text */
  placeholder = input<string>('');
  /** Input type */
  type = input<string>('text');
  /** Disabled state (from template) */
  disabled = input(false);
  /** Required state */
  required = input(false);
  /** Invalid state */
  invalid = input(false);
  /** Error message to show when invalid */
  errorMessage = input<string>('');

  /** Unique IDs for a11y */
  readonly inputId = `glint-input-${nextId++}`;
  readonly errorId = `${this.inputId}-error`;

  /** Internal value state */
  protected value = signal('');
  /** Focus tracking */
  protected focused = signal(false);

  /** CVA disabled state merged with input disabled */
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  // ── ControlValueAccessor ─────────────────────
  writeValue(value: string): void {
    this.value.set(value ?? '');
  }

  registerOnChange(fn: (value: string) => void): void {
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
    const value = (event.target as HTMLInputElement).value;
    this.value.set(value);
    this.onChange(value);
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }
}
