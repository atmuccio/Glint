import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

/**
 * Toggle button component with ControlValueAccessor.
 * A button that toggles between pressed and unpressed states.
 *
 * @example
 * ```html
 * <glint-toggle-button [formControl]="boldCtrl" onLabel="Bold" offLabel="Bold" />
 * <glint-toggle-button onIcon="star" offIcon="star-outline">Favorite</glint-toggle-button>
 * ```
 */
@Component({
  selector: 'glint-toggle-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.pressed]': 'pressed()',
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

    .toggle-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--glint-spacing-sm);
      font-family: inherit;
      font-size: inherit;
      font-weight: var(--glint-font-weight);
      line-height: 1.25;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      cursor: pointer;
      user-select: none;
      outline: none;
      background: var(--glint-color-surface-variant);
      color: var(--glint-color-text);
      transition:
        background-color var(--glint-duration-normal) var(--glint-easing),
        color var(--glint-duration-normal) var(--glint-easing),
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
    }

    .toggle-btn:hover:not(:disabled) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), black 5%);
    }

    .toggle-btn:active:not(:disabled) {
      background: color-mix(in oklch, var(--glint-color-surface-variant), black 12%);
    }

    :host(.pressed) .toggle-btn {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      border-color: var(--glint-color-primary);
    }

    :host(.pressed) .toggle-btn:hover:not(:disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), white 15%);
      border-color: color-mix(in oklch, var(--glint-color-primary), white 15%);
    }

    :host(.pressed) .toggle-btn:active:not(:disabled) {
      background: color-mix(in oklch, var(--glint-color-primary), white 30%);
      border-color: color-mix(in oklch, var(--glint-color-primary), white 30%);
    }

    .toggle-btn:focus-visible {
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    .toggle-btn:disabled {
      cursor: not-allowed;
    }
  `,
  template: `
    <button
      class="toggle-btn"
      type="button"
      role="button"
      [attr.aria-pressed]="pressed()"
      [disabled]="isDisabled()"
      (click)="onToggle()"
    >
      @if (currentIcon()) {
        <span class="icon" aria-hidden="true">{{ currentIcon() }}</span>
      }
      @if (currentLabel()) {
        <span class="label">{{ currentLabel() }}</span>
      }
      <ng-content />
    </button>
  `,
})
export class GlintToggleButtonComponent implements ControlValueAccessor {
  /** Disabled state */
  disabled = input(false);
  /** Label text displayed when pressed */
  onLabel = input('');
  /** Label text displayed when unpressed */
  offLabel = input('');
  /** Icon displayed when pressed */
  onIcon = input('');
  /** Icon displayed when unpressed */
  offIcon = input('');

  protected pressed = signal(false);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  protected currentLabel = computed(() =>
    this.pressed() ? this.onLabel() : this.offLabel()
  );

  protected currentIcon = computed(() =>
    this.pressed() ? this.onIcon() : this.offIcon()
  );

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: boolean) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: boolean | null): void {
    this.pressed.set(!!value);
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

  protected onToggle(): void {
    if (this.isDisabled()) return;
    const next = !this.pressed();
    this.pressed.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
