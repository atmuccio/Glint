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
 * Password input with toggle visibility and optional strength meter.
 *
 * @example
 * ```html
 * <glint-password label="Password" [formControl]="passwordCtrl" [showStrength]="true" />
 * ```
 */
@Component({
  selector: 'glint-password',
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

    .label {
      display: block;
      margin-block-end: var(--glint-spacing-xs);
      font-weight: 500;
      color: var(--glint-color-text);
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

    .toggle {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      padding-inline: var(--glint-spacing-sm);
      font-size: 0.875rem;
      block-size: 100%;
      transition: color var(--glint-duration-fast) var(--glint-easing);
    }
    .toggle:hover { color: var(--glint-color-text); }
    .toggle:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .strength-meter {
      display: flex;
      gap: 2px;
      margin-block-start: var(--glint-spacing-xs);
    }

    .strength-bar {
      flex: 1;
      block-size: 4px;
      border-radius: 2px;
      background: var(--glint-color-border);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .strength-bar.weak { background: var(--glint-color-error); }
    .strength-bar.medium { background: var(--glint-color-warning); }
    .strength-bar.strong { background: var(--glint-color-success); }
  `,
  template: `
    @if (label()) {
      <label class="label" [attr.for]="inputId">{{ label() }}</label>
    }
    <div class="input-wrapper">
      <input
        #inputEl
        [id]="inputId"
        [type]="visible() ? 'text' : 'password'"
        [placeholder]="placeholder()"
        [attr.aria-label]="label() || 'Password'"
        (input)="onInput($event)"
        (focus)="focused.set(true)"
        (blur)="onBlur()"
      />
      <button
        class="toggle"
        type="button"
        tabindex="-1"
        [attr.aria-label]="visible() ? 'Hide password' : 'Show password'"
        (click)="toggleVisibility()"
      >
        @if (visible()) {
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
            <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
            <line x1="1" y1="1" x2="23" y2="23"/>
          </svg>
        } @else {
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        }
      </button>
    </div>
    @if (showStrength() && value()) {
      <div class="strength-meter">
        <div class="strength-bar" [class]="strengthLevel()"></div>
        <div class="strength-bar" [class]="strengthLevel() !== 'weak' ? strengthLevel() : ''"></div>
        <div class="strength-bar" [class]="strengthLevel() === 'strong' ? 'strong' : ''"></div>
      </div>
    }
  `,
})
export class GlintPasswordComponent implements ControlValueAccessor {
  /** Label text */
  label = input('');
  /** Placeholder text */
  placeholder = input('');
  /** Show strength meter */
  showStrength = input(false);
  /** Disabled state */
  disabled = input<boolean | undefined>(undefined);

  readonly inputId = glintId('glint-password');

  protected value = signal('');
  protected focused = signal(false);
  protected visible = signal(false);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() === true || this.disabledFromCVA());

  private inputRef = viewChild<ElementRef<HTMLInputElement>>('inputEl');
  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: string) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  protected strengthLevel = computed(() => {
    const v = this.value();
    if (!v) return '';
    let score = 0;
    if (v.length >= 8) score++;
    if (/[A-Z]/.test(v) && /[a-z]/.test(v)) score++;
    if (/\d/.test(v)) score++;
    if (/[^A-Za-z0-9]/.test(v)) score++;
    if (score <= 1) return 'weak';
    if (score <= 2) return 'medium';
    return 'strong';
  });

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

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
    const el = this.inputRef()?.nativeElement;
    if (el) el.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabledFromCVA.set(isDisabled); }

  protected onInput(event: Event): void {
    const v = (event.target as HTMLInputElement).value;
    this.value.set(v);
    this.onChange(v);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  protected toggleVisibility(): void {
    this.visible.update(v => !v);
  }
}
