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
 * Range slider with min/max/step and CVA support.
 *
 * @example
 * ```html
 * <glint-slider [min]="0" [max]="100" [step]="5" [formControl]="volumeCtrl" />
 * ```
 */
@Component({
  selector: 'glint-slider',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      padding-block: var(--glint-spacing-sm);
    }

    .slider-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      block-size: 1.5rem;
    }

    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      inline-size: 100%;
      block-size: 4px;
      border-radius: 2px;
      background: linear-gradient(
        to right,
        var(--glint-color-primary) 0%,
        var(--glint-color-primary) var(--fill),
        var(--glint-color-border) var(--fill),
        var(--glint-color-border) 100%
      );
      outline: none;
      cursor: pointer;
      margin: 0;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      inline-size: 1.125rem;
      block-size: 1.125rem;
      border-radius: 50%;
      background: var(--glint-color-primary);
      border: 2px solid var(--glint-color-surface);
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
      cursor: pointer;
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      transform: scale(1.15);
    }

    input[type="range"]::-moz-range-thumb {
      inline-size: 1.125rem;
      block-size: 1.125rem;
      border-radius: 50%;
      background: var(--glint-color-primary);
      border: 2px solid var(--glint-color-surface);
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.2);
      cursor: pointer;
    }

    input[type="range"]:focus-visible {
      outline: none;
    }
    input[type="range"]:focus-visible::-webkit-slider-thumb {
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    :host(.disabled) input[type="range"] {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .labels {
      position: relative;
      display: flex;
      justify-content: space-between;
      font-size: 0.75rem;
      color: var(--glint-color-text-muted);
      margin-block-start: var(--glint-spacing-xs);
    }

    .labels .value-label {
      position: absolute;
      left: var(--fill);
      transform: translateX(-50%);
      font-weight: 600;
      color: var(--glint-color-primary);
    }
  `,
  template: `
    <div class="slider-wrapper">
      <input
        type="range"
        [min]="min()"
        [max]="max()"
        [step]="step()"
        [value]="value()"
        [disabled]="isDisabled()"
        [style.--fill]="fillPercent()"
        [attr.aria-valuemin]="min()"
        [attr.aria-valuemax]="max()"
        [attr.aria-valuenow]="value()"
        (input)="onInput($event)"
        (change)="onTouched()"
      />
    </div>
    @if (showLabels()) {
      <div class="labels" [style.--fill]="fillPercent()">
        <span>{{ min() }}</span>
        <span class="value-label">{{ value() }}</span>
        <span>{{ max() }}</span>
      </div>
    }
  `,
})
export class GlintSliderComponent implements ControlValueAccessor {
  /** Minimum value */
  min = input(0);
  /** Maximum value */
  max = input(100);
  /** Step increment */
  step = input(1);
  /** Show min/current/max labels */
  showLabels = input(false);
  /** Disabled state */
  disabled = input(false);

  protected value = signal(0);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  protected fillPercent = computed(() => {
    const range = this.max() - this.min();
    if (range <= 0) return '0%';
    return `${((this.value() - this.min()) / range) * 100}%`;
  });

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: number) => void = () => { /* noop */ };
  protected onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? this.min());
  }

  registerOnChange(fn: (value: number) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(isDisabled: boolean): void { this.disabledFromCVA.set(isDisabled); }

  protected onInput(event: Event): void {
    const v = parseFloat((event.target as HTMLInputElement).value);
    this.value.set(v);
    this.onChange(v);
  }
}
