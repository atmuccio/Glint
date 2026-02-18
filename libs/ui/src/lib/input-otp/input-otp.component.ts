import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  output,
  signal,
  untracked,
  viewChildren,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

let nextId = 0;

/**
 * One-time-password input with individual character boxes.
 *
 * @example
 * ```html
 * <glint-input-otp [length]="6" [formControl]="otpCtrl" (complete)="onComplete($event)" />
 * <glint-input-otp [length]="4" [integerOnly]="true" [mask]="true" />
 * ```
 */
@Component({
  selector: 'glint-input-otp',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()',
    style: 'display: inline-flex; gap: var(--glint-spacing-sm);',
  },
  styles: `
    :host {
      font-family: var(--glint-font-family);
    }

    .otp-input {
      inline-size: 2.5rem;
      block-size: 2.5rem;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-family: inherit;
      font-size: 1.25rem;
      text-align: center;
      outline: none;
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    .otp-input:focus {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    :host(.disabled) .otp-input {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  template: `
    @for (i of indices(); track i) {
      <input
        #otpInput
        class="otp-input"
        [id]="inputId + '-' + i"
        [type]="mask() ? 'password' : 'text'"
        maxlength="1"
        autocomplete="one-time-code"
        [attr.aria-label]="'Digit ' + (i + 1) + ' of ' + length()"
        [value]="values()[i] || ''"
        (input)="onInput($event, i)"
        (keydown)="onKeydown($event, i)"
        (focus)="onFocus(i)"
        (blur)="onBlur()"
        (paste)="onPaste($event, i)"
      />
    }
  `,
})
export class GlintInputOtpComponent implements ControlValueAccessor {
  /** Number of OTP digits */
  length = input(4);
  /** Restrict to digits only */
  integerOnly = input(false);
  /** Show dots instead of characters */
  mask = input(false);
  /** Disabled state */
  disabled = input<boolean | undefined>(undefined);

  /** Emitted when all inputs are filled */
  complete = output<string>();

  readonly inputId = `glint-input-otp-${nextId++}`;

  /** Array of individual character values */
  protected values = signal<string[]>([]);

  /** Array of indices for @for loop */
  protected indices = computed(() => Array.from({ length: this.length() }, (_, i) => i));

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() === true || this.disabledFromCVA());

  private otpInputs = viewChildren<ElementRef<HTMLInputElement>>('otpInput');
  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: string) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Initialize values array when length changes
    effect(() => {
      const len = this.length();
      const current = untracked(() => this.values());
      if (current.length !== len) {
        const newValues = new Array(len).fill('') as string[];
        for (let i = 0; i < Math.min(current.length, len); i++) {
          newValues[i] = current[i];
        }
        this.values.set(newValues);
      }
    });

    effect(() => {
      const disabled = this.disabled();
      untracked(() => {
        queueMicrotask(() => {
          const control = this.ngControl?.control;
          if (control && disabled !== undefined) {
            if (disabled && !control.disabled) control.disable({ emitEvent: false });
            else if (!disabled && control.disabled) control.enable({ emitEvent: false });
          }
        });
      });
    });

    afterRenderEffect({
      write: () => {
        const disabled = this.isDisabled();
        const inputs = this.otpInputs();
        for (const ref of inputs) {
          ref.nativeElement.disabled = disabled;
        }
      },
    });
  }

  // ── ControlValueAccessor ─────────────────────
  writeValue(value: string | null): void {
    const len = this.length();
    const incoming = value ?? '';
    const newValues = new Array(len).fill('') as string[];
    for (let i = 0; i < Math.min(incoming.length, len); i++) {
      newValues[i] = incoming[i];
    }
    this.values.set(newValues);

    // Sync native inputs
    const inputs = this.otpInputs();
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].nativeElement.value = newValues[i] || '';
    }
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabledFromCVA.set(isDisabled); }

  // ── Event handlers ───────────────────────────
  protected onInput(event: Event, index: number): void {
    if (this.isDisabled()) return;

    const input = event.target as HTMLInputElement;
    let char = input.value;

    // Validate character
    if (char && this.integerOnly() && !/^\d$/.test(char)) {
      input.value = this.values()[index] || '';
      return;
    }

    // Take only the last character if multiple were entered
    if (char.length > 1) {
      char = char[char.length - 1];
      input.value = char;
    }

    const vals = [...this.values()];
    vals[index] = char;
    this.values.set(vals);
    this.emitChange(vals);

    // Auto-advance to next input
    if (char && index < this.length() - 1) {
      this.focusInput(index + 1);
    }
  }

  protected onKeydown(event: KeyboardEvent, index: number): void {
    if (this.isDisabled()) return;

    if (event.key === 'Backspace') {
      const vals = [...this.values()];
      if (vals[index]) {
        // Clear current input
        vals[index] = '';
        this.values.set(vals);
        this.emitChange(vals);
        this.syncNativeInput(index, '');
      } else if (index > 0) {
        // Move to previous and clear it
        vals[index - 1] = '';
        this.values.set(vals);
        this.emitChange(vals);
        this.syncNativeInput(index - 1, '');
        this.focusInput(index - 1);
      }
      event.preventDefault();
      return;
    }

    if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      this.focusInput(index - 1);
      return;
    }

    if (event.key === 'ArrowRight' && index < this.length() - 1) {
      event.preventDefault();
      this.focusInput(index + 1);
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      const vals = [...this.values()];
      vals[index] = '';
      this.values.set(vals);
      this.emitChange(vals);
      this.syncNativeInput(index, '');
      return;
    }
  }

  protected onPaste(event: ClipboardEvent, startIndex: number): void {
    event.preventDefault();
    if (this.isDisabled()) return;

    const pastedText = event.clipboardData?.getData('text') ?? '';
    if (!pastedText) return;

    const vals = [...this.values()];
    let pasteIdx = 0;
    for (let i = startIndex; i < this.length() && pasteIdx < pastedText.length; pasteIdx++) {
      const ch = pastedText[pasteIdx];
      if (this.integerOnly() && !/^\d$/.test(ch)) continue;
      vals[i] = ch;
      this.syncNativeInput(i, ch);
      i++;
    }

    this.values.set(vals);
    this.emitChange(vals);

    // Focus the next empty or last input
    const nextEmpty = vals.findIndex(v => !v);
    this.focusInput(nextEmpty >= 0 ? nextEmpty : this.length() - 1);
  }

  protected onFocus(index: number): void {
    // Select existing content on focus
    const inputs = this.otpInputs();
    if (inputs[index]) {
      inputs[index].nativeElement.select();
    }
  }

  protected onBlur(): void {
    this.onTouched();
  }

  // ── Helpers ─────────────────────────────────
  private focusInput(index: number): void {
    const inputs = this.otpInputs();
    if (inputs[index]) {
      queueMicrotask(() => {
        inputs[index].nativeElement.focus();
        inputs[index].nativeElement.select();
      });
    }
  }

  private syncNativeInput(index: number, value: string): void {
    const inputs = this.otpInputs();
    if (inputs[index]) {
      inputs[index].nativeElement.value = value;
    }
  }

  private emitChange(vals: string[]): void {
    const concatenated = vals.join('');
    this.onChange(concatenated);

    if (vals.every(v => v !== '')) {
      this.complete.emit(concatenated);
    }
  }
}
