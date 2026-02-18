import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { glintId } from '../core/utils/id-generator';

/**
 * Textarea component with ControlValueAccessor, auto-resize, and validation support.
 *
 * @example
 * ```html
 * <glint-textarea label="Comments" [formControl]="commentsCtrl" [autoResize]="true" />
 * ```
 */
@Component({
  selector: 'glint-textarea',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[attr.data-variant]': 'variant()',
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

    .textarea-wrapper {
      display: flex;
      border-radius: var(--glint-border-radius);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    :host([data-variant="outline"]) .textarea-wrapper {
      border: 1px solid var(--glint-color-border);
      background: var(--glint-color-surface);
      padding-inline: var(--glint-spacing-md);
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
    }
    :host([data-variant="outline"].focused) .textarea-wrapper {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }
    :host([data-variant="outline"].invalid) .textarea-wrapper {
      border-color: var(--glint-color-error);
    }

    :host([data-variant="filled"]) .textarea-wrapper {
      border: 1px solid transparent;
      border-block-end: 2px solid var(--glint-color-border);
      background: var(--glint-color-surface-variant);
      padding-inline: var(--glint-spacing-md);
      border-radius: var(--glint-border-radius) var(--glint-border-radius) 0 0;
    }
    :host([data-variant="filled"].focused) .textarea-wrapper {
      border-block-end-color: var(--glint-color-primary);
    }

    textarea {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font: inherit;
      color: var(--glint-color-text);
      padding-block: var(--glint-spacing-sm);
      min-inline-size: 0;
      resize: vertical;
    }

    textarea::placeholder {
      color: var(--glint-color-text-muted);
    }

    :host(.disabled) textarea {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .error {
      margin-block-start: var(--glint-spacing-xs);
      font-size: 0.875em;
      color: var(--glint-color-error);
    }
  `,
  template: `
    @if (label()) {
      <label class="label" [attr.for]="textareaId">{{ label() }}</label>
    }
    <div class="textarea-wrapper">
      <textarea
        #textareaEl
        [id]="textareaId"
        [placeholder]="placeholder()"
        [rows]="rows()"
        [required]="required()"
        [attr.aria-invalid]="invalid() || null"
        [attr.aria-describedby]="invalid() && errorMessage() ? errorId : null"
        (input)="onInput($event)"
        (focus)="onFocus()"
        (blur)="onBlur()"
      ></textarea>
    </div>
    @if (invalid() && errorMessage()) {
      <div class="error" [id]="errorId" role="alert">{{ errorMessage() }}</div>
    }
  `,
})
export class GlintTextareaComponent implements ControlValueAccessor {
  /** Input variant */
  variant = input<'outline' | 'filled'>('outline');
  /** Label text */
  label = input('');
  /** Placeholder text */
  placeholder = input('');
  /** Number of visible rows */
  rows = input(3);
  /** Auto-resize to content height */
  autoResize = input(false);
  /** Disabled state */
  disabled = input(false);
  /** Required state */
  required = input(false);
  /** Invalid state */
  invalid = input(false);
  /** Error message */
  errorMessage = input('');

  readonly textareaId = glintId('glint-textarea');
  readonly errorId = `${this.textareaId}-error`;

  protected value = signal('');
  protected focused = signal(false);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private textareaRef = viewChild<ElementRef<HTMLTextAreaElement>>('textareaEl');

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: string) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }

    afterRenderEffect({
      write: () => {
        const disabled = this.isDisabled();
        const el = this.textareaRef()?.nativeElement;
        if (el) {
          el.disabled = disabled;
        }
      },
    });
  }

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
    const el = this.textareaRef()?.nativeElement;
    if (el) {
      el.value = value ?? '';
      if (this.autoResize()) {
        this.adjustHeight(el);
      }
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

  protected onInput(event: Event): void {
    const el = event.target as HTMLTextAreaElement;
    this.value.set(el.value);
    this.onChange(el.value);
    if (this.autoResize()) {
      this.adjustHeight(el);
    }
  }

  protected onFocus(): void {
    this.focused.set(true);
  }

  protected onBlur(): void {
    this.focused.set(false);
    this.onTouched();
  }

  private adjustHeight(el: HTMLTextAreaElement): void {
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;
  }
}
