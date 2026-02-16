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

let nextId = 0;

/**
 * Input component with ControlValueAccessor, zone-aware styling, and validation support.
 *
 * When used with reactive forms, disable via `ctrl.disable()` — or use the
 * `disabled` input, which automatically syncs to the FormControl.
 *
 * @example
 * ```html
 * <glint-input label="Email" placeholder="you@example.com" [formControl]="emailCtrl" />
 * <glint-input label="Name" variant="filled" [disabled]="true" />
 * ```
 */
@Component({
  selector: 'glint-input',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
    '[attr.data-size]': 'size()',
    '[class.focused]': 'focused()',
    '[class.disabled]': 'isDisabled()',
    '[class.invalid]': 'invalid()',
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
      transition: color var(--glint-duration-normal) var(--glint-easing);
    }

    :host(.invalid) .label {
      color: color-mix(in oklch, var(--glint-color-text), var(--glint-color-error) 40%);
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
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
    :host([data-variant="outline"].focused) .input-wrapper {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }
    :host([data-variant="outline"].invalid) .input-wrapper {
      border-color: var(--glint-color-error);
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
      color: var(--glint-color-error);
    }

    /* ── Sizes ─────────────────────────────────── */
    :host([data-size="sm"]) {
      font-size: 0.875rem;
    }
    :host([data-size="sm"]) input {
      padding-block: var(--glint-spacing-xs);
    }

    :host([data-size="lg"]) {
      font-size: 1.125rem;
    }
    :host([data-size="lg"]) input {
      padding-block: var(--glint-spacing-md);
    }
  `,
  template: `
    @if (label()) {
      <label class="label" [attr.for]="inputId">{{ label() }}</label>
    }
    <div class="input-wrapper">
      <ng-content select="[glintPrefix]" />
      <input
        #inputEl
        [id]="inputId"
        [type]="type()"
        [placeholder]="placeholder()"
        [required]="required()"
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
  /** Size */
  size = input<'sm' | 'md' | 'lg'>('md');
  /** Label text */
  label = input<string>('');
  /** Placeholder text */
  placeholder = input<string>('');
  /** Input type */
  type = input<string>('text');
  /**
   * Disabled state (from template). When a FormControl is attached, this syncs to the control.
   * Defaults to `undefined` so the effect only touches the control when explicitly bound.
   */
  disabled = input<boolean | undefined>(undefined);
  /** Required state */
  required = input(false);
  /** Invalid state */
  invalid = input(false);
  /** Error message to show when invalid */
  errorMessage = input<string>('');

  /** Unique IDs for a11y */
  readonly inputId = `glint-input-${nextId++}`;
  readonly errorId = `${this.inputId}-error`;

  /** Internal value state (for display text tracking) */
  protected value = signal('');
  /** Focus tracking */
  protected focused = signal(false);

  /** Tracks disabled state driven by the CVA (FormControl) */
  private disabledFromCVA = signal(false);
  /** Merged disabled: either the input prop OR the CVA says disabled */
  isDisabled = computed(() => this.disabled() === true || this.disabledFromCVA());

  /** Native input ref — value and disabled driven by effects, not template bindings */
  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  /**
   * NgControl injected directly (no NG_VALUE_ACCESSOR provider needed).
   * This avoids circular dependency and lets us sync disabled → control.
   */
  private ngControl = inject(NgControl, { optional: true, self: true });

  private onChange: (value: string) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    // Wire up CVA manually — avoids NG_VALUE_ACCESSOR provider + NgControl circular dep
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    // Sync disabled input → FormControl when a control is attached.
    // Only acts when the input has been explicitly bound (not undefined default).
    // Uses queueMicrotask to ensure ngControl.control is available (may be null during construction).
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

    // Drive native <input> disabled from the merged signal
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
  writeValue(value: string | null): void {
    this.value.set(value ?? '');
    // Write directly to native element to avoid cursor-jump from template [value] binding
    const el = this.inputRef()?.nativeElement;
    if (el) {
      el.value = value ?? '';
    }
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
