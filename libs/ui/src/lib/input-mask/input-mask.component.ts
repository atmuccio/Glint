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

interface MaskSlot {
  type: 'digit' | 'letter' | 'any' | 'literal';
  char: string;
}

/**
 * Masked text input that enforces a specific format pattern.
 *
 * Mask characters:
 * - `9` = digit (0-9)
 * - `a` = letter (a-z, A-Z)
 * - `*` = alphanumeric (digit or letter)
 * - Any other character is a literal separator
 *
 * @example
 * ```html
 * <glint-input-mask mask="(999) 999-9999" placeholder="(___) ___-____" [formControl]="phoneCtrl" />
 * <glint-input-mask mask="99/99/9999" [formControl]="dateCtrl" />
 * <glint-input-mask mask="aa-9999" [formControl]="codeCtrl" />
 * ```
 */
@Component({
  selector: 'glint-input-mask',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.focused]': 'focused()',
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .input-wrapper {
      display: flex;
      align-items: center;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    :host(.focused) .input-wrapper {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
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
    }

    input::placeholder {
      color: var(--glint-color-text-muted);
    }

    :host(.disabled) input {
      opacity: 0.5;
      cursor: not-allowed;
    }
  `,
  template: `
    <div class="input-wrapper">
      <input
        #inputEl
        [id]="inputId"
        type="text"
        [placeholder]="computedPlaceholder()"
        [attr.aria-label]="'Masked input'"
        (input)="onInput($event)"
        (keydown)="onKeydown($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
        (paste)="onPaste($event)"
      />
    </div>
  `,
})
export class GlintInputMaskComponent implements ControlValueAccessor {
  /** Mask pattern: 9=digit, a=letter, *=alphanumeric, others=literal */
  mask = input.required<string>();
  /** Placeholder text. Defaults to mask with slot chars replacing mask chars */
  placeholder = input<string>('');
  /** Character shown in unfilled slots */
  slotChar = input('_');
  /** Clear incomplete value on blur */
  autoClear = input(true);
  /** Disabled state */
  disabled = input<boolean | undefined>(undefined);

  readonly inputId = glintId('glint-input-mask');

  protected focused = signal(false);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() === true || this.disabledFromCVA());

  /** Parsed mask structure */
  protected parsedMask = computed<MaskSlot[]>(() => {
    return this.parseMask(this.mask());
  });

  /** Indices of editable (non-literal) slots */
  protected editableIndices = computed<number[]>(() => {
    return this.parsedMask()
      .map((slot, i) => (slot.type !== 'literal' ? i : -1))
      .filter(i => i !== -1);
  });

  /** Auto-generated placeholder from mask pattern */
  protected computedPlaceholder = computed(() => {
    const explicit = this.placeholder();
    if (explicit) return explicit;
    const sc = this.slotChar();
    return this.parsedMask()
      .map(slot => (slot.type === 'literal' ? slot.char : sc))
      .join('');
  });

  /** Current display value with slot chars for unfilled positions */
  protected displayValue = signal('');

  /** Array of raw user-input characters (one per editable slot, empty string if unfilled) */
  private rawValues = signal<string[]>([]);

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: string) => void = () => { /* noop */ };
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
            if (disabled && !control.disabled) control.disable({ emitEvent: false });
            else if (!disabled && control.disabled) control.enable({ emitEvent: false });
          }
        });
      });
    });

    afterRenderEffect({
      write: () => {
        const disabled = this.isDisabled();
        const el = this.inputRef()?.nativeElement;
        if (el) el.disabled = disabled;
      },
    });
  }

  // ── ControlValueAccessor ─────────────────────
  writeValue(value: string | null): void {
    const mask = this.parsedMask();
    const editable = this.editableIndices();
    const incoming = value ?? '';

    // Distribute incoming value characters into raw slots
    const raw: string[] = new Array(editable.length).fill('');
    let charIdx = 0;
    for (let i = 0; i < editable.length && charIdx < incoming.length; i++) {
      const ch = incoming[charIdx];
      const slot = mask[editable[i]];
      if (this.isValidForSlot(ch, slot)) {
        raw[i] = ch;
        charIdx++;
      } else {
        // Skip invalid characters
        charIdx++;
        i--; // retry this slot
      }
    }
    this.rawValues.set(raw);
    const display = this.buildDisplay(raw);
    this.displayValue.set(display);
    const el = this.inputRef()?.nativeElement;
    if (el) el.value = display;
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabledFromCVA.set(isDisabled); }

  // ── Event handlers ───────────────────────────
  protected onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    const el = this.inputRef()?.nativeElement;
    if (!el) return;

    const mask = this.parsedMask();
    const editable = this.editableIndices();
    const raw = [...this.rawValues()];

    if (event.key === 'Backspace') {
      event.preventDefault();
      const cursorPos = el.selectionStart ?? 0;
      // Find the editable slot at or before cursor
      const editIdx = this.findEditableIndexBefore(cursorPos, editable);
      if (editIdx >= 0) {
        raw[editIdx] = '';
        this.rawValues.set(raw);
        this.updateDisplay(raw);
        this.emitValue(raw);
        // Position cursor at the cleared slot
        const newPos = editable[editIdx];
        queueMicrotask(() => el.setSelectionRange(newPos, newPos));
      }
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      const cursorPos = el.selectionStart ?? 0;
      const editIdx = this.findEditableIndexAt(cursorPos, editable);
      if (editIdx >= 0) {
        raw[editIdx] = '';
        this.rawValues.set(raw);
        this.updateDisplay(raw);
        this.emitValue(raw);
        const newPos = editable[editIdx];
        queueMicrotask(() => el.setSelectionRange(newPos, newPos));
      }
      return;
    }

    // Allow navigation keys
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Tab'].includes(event.key)) {
      return;
    }

    // Block ctrl/meta combos except paste (Ctrl+V)
    if (event.ctrlKey || event.metaKey) {
      return;
    }

    // Printable character
    if (event.key.length === 1) {
      event.preventDefault();
      const cursorPos = el.selectionStart ?? 0;
      const editIdx = this.findEditableIndexAt(cursorPos, editable);
      if (editIdx < 0) return; // No more editable slots

      const slot = mask[editable[editIdx]];
      if (!this.isValidForSlot(event.key, slot)) return; // Invalid character

      raw[editIdx] = event.key;
      this.rawValues.set(raw);
      this.updateDisplay(raw);
      this.emitValue(raw);

      // Move cursor to next editable position (or end)
      const nextPos = editIdx + 1 < editable.length ? editable[editIdx + 1] : mask.length;
      queueMicrotask(() => el.setSelectionRange(nextPos, nextPos));
    }
  }

  protected onInput(event: Event): void {
    // The keydown handler prevents default for valid keys, so input events
    // only fire for browser auto-fill or other uncontrolled input.
    // Re-sync the display value to prevent corruption.
    event.preventDefault();
    const el = this.inputRef()?.nativeElement;
    if (el) {
      el.value = this.buildDisplay(this.rawValues());
    }
  }

  protected onPaste(event: ClipboardEvent): void {
    event.preventDefault();
    if (this.isDisabled()) return;

    const el = this.inputRef()?.nativeElement;
    if (!el) return;

    const pastedText = event.clipboardData?.getData('text') ?? '';
    if (!pastedText) return;

    const mask = this.parsedMask();
    const editable = this.editableIndices();
    const raw = [...this.rawValues()];
    const cursorPos = el.selectionStart ?? 0;

    const startEditIdx = this.findEditableIndexAt(cursorPos, editable);
    if (startEditIdx < 0) return;

    let pasteIdx = 0;
    for (let editIdx = startEditIdx; editIdx < editable.length && pasteIdx < pastedText.length; pasteIdx++) {
      const ch = pastedText[pasteIdx];
      const slot = mask[editable[editIdx]];
      if (this.isValidForSlot(ch, slot)) {
        raw[editIdx] = ch;
        editIdx++;
      }
    }

    this.rawValues.set(raw);
    this.updateDisplay(raw);
    this.emitValue(raw);
  }

  protected onFocus(): void {
    this.focused.set(true);
    // Place cursor at first empty slot
    const el = this.inputRef()?.nativeElement;
    if (el) {
      const editable = this.editableIndices();
      const raw = this.rawValues();
      const firstEmpty = raw.findIndex(v => !v);
      if (firstEmpty >= 0) {
        const pos = editable[firstEmpty];
        queueMicrotask(() => el.setSelectionRange(pos, pos));
      }
    }
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();

    if (this.autoClear()) {
      const raw = this.rawValues();
      const isComplete = raw.every(v => v !== '');
      if (!isComplete && raw.some(v => v !== '')) {
        // Incomplete — clear
        const cleared = new Array(raw.length).fill('') as string[];
        this.rawValues.set(cleared);
        this.updateDisplay(cleared);
        this.onChange('');
      }
    }
  }

  // ── Helpers ─────────────────────────────────
  private parseMask(mask: string): MaskSlot[] {
    const slots: MaskSlot[] = [];
    for (const ch of mask) {
      if (ch === '9') {
        slots.push({ type: 'digit', char: ch });
      } else if (ch === 'a') {
        slots.push({ type: 'letter', char: ch });
      } else if (ch === '*') {
        slots.push({ type: 'any', char: ch });
      } else {
        slots.push({ type: 'literal', char: ch });
      }
    }
    return slots;
  }

  private isValidForSlot(ch: string, slot: MaskSlot): boolean {
    switch (slot.type) {
      case 'digit':
        return /^\d$/.test(ch);
      case 'letter':
        return /^[a-zA-Z]$/.test(ch);
      case 'any':
        return /^[a-zA-Z0-9]$/.test(ch);
      default:
        return false;
    }
  }

  private buildDisplay(raw: string[]): string {
    const mask = this.parsedMask();
    const sc = this.slotChar();
    let editIdx = 0;
    return mask
      .map(slot => {
        if (slot.type === 'literal') return slot.char;
        const val = raw[editIdx] || sc;
        editIdx++;
        return val;
      })
      .join('');
  }

  private updateDisplay(raw: string[]): void {
    const display = this.buildDisplay(raw);
    this.displayValue.set(display);
    const el = this.inputRef()?.nativeElement;
    if (el) el.value = display;
  }

  private emitValue(raw: string[]): void {
    const display = this.buildDisplay(raw);
    const isEmpty = raw.every(v => v === '');
    if (isEmpty) {
      this.onChange('');
    } else {
      this.onChange(display);
    }
  }

  private findEditableIndexBefore(cursorPos: number, editable: number[]): number {
    // Find the highest editable index whose position is < cursorPos
    for (let i = editable.length - 1; i >= 0; i--) {
      if (editable[i] < cursorPos) return i;
    }
    return -1;
  }

  private findEditableIndexAt(cursorPos: number, editable: number[]): number {
    // Find the first editable index at or after cursorPos
    for (let i = 0; i < editable.length; i++) {
      if (editable[i] >= cursorPos) return i;
    }
    return -1;
  }
}
