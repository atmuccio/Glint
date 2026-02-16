import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';

let nextId = 0;

/**
 * Toggle switch component with ControlValueAccessor.
 *
 * @example
 * ```html
 * <glint-toggle-switch [formControl]="darkModeCtrl">Dark mode</glint-toggle-switch>
 * ```
 */
@Component({
  selector: 'glint-toggle-switch',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.checked]': 'checked()',
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

    .track {
      position: relative;
      display: inline-flex;
      align-items: center;
      inline-size: 2.5rem;
      block-size: 1.375rem;
      border-radius: 9999px;
      background: var(--glint-color-border);
      flex-shrink: 0;
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.checked) .track {
      background: var(--glint-color-primary);
    }

    :host(:hover:not(.disabled)) .track {
      background: color-mix(in oklch, var(--glint-color-border), black 10%);
    }
    :host(.checked:hover:not(.disabled)) .track {
      background: color-mix(in oklch, var(--glint-color-primary), black 10%);
    }

    .track:focus-visible {
      outline: none;
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    .thumb {
      position: absolute;
      inset-inline-start: 2px;
      inline-size: 1.125rem;
      block-size: 1.125rem;
      border-radius: 50%;
      background: white;
      box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
      transition: inset-inline-start var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.checked) .thumb {
      inset-inline-start: calc(100% - 1.125rem - 2px);
    }
  `,
  template: `
    <span
      class="track"
      role="switch"
      tabindex="0"
      [attr.aria-checked]="checked()"
      [attr.aria-disabled]="isDisabled() || null"
      [attr.aria-labelledby]="labelId"
      (click)="onToggle()"
      (keydown.space)="onToggle(); $event.preventDefault()"
    >
      <span class="thumb"></span>
    </span>
    <span [id]="labelId"><ng-content /></span>
  `,
})
export class GlintToggleSwitchComponent implements ControlValueAccessor {
  /** Disabled state */
  disabled = input(false);

  readonly labelId = `glint-toggle-label-${nextId++}`;

  protected checked = signal(false);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: boolean) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

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

  protected onToggle(): void {
    if (this.isDisabled()) return;
    const next = !this.checked();
    this.checked.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
