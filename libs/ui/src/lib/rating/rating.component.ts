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
 * Star rating component with ControlValueAccessor.
 * Allows selecting a rating value from 0 to the configured star count.
 *
 * @example
 * ```html
 * <glint-rating [formControl]="ratingCtrl" />
 * <glint-rating [stars]="10" [cancel]="false" [readonly]="true" />
 * ```
 */
@Component({
  selector: 'glint-rating',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'radiogroup',
    '[attr.aria-label]': '"Rating"',
    '[class.disabled]': 'isDisabled()',
    '[class.readonly]': 'readonly()',
    '(mouseleave)': 'onHostMouseLeave()',
  },
  styles: `
    :host {
      display: inline-flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      font-family: var(--glint-font-family);
      cursor: pointer;
    }

    :host(.disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    :host(.readonly) {
      pointer-events: none;
    }

    .cancel-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 2px;
      border-radius: var(--glint-border-radius);
      color: var(--glint-color-text-muted);
      transition: color var(--glint-duration-fast) var(--glint-easing);
      background: none;
      border: none;
      font: inherit;
      outline: none;
    }

    .cancel-icon:hover {
      color: var(--glint-color-error);
    }

    .cancel-icon:focus-visible {
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    .cancel-icon svg {
      inline-size: 1.25rem;
      block-size: 1.25rem;
    }

    .star {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      padding: 2px;
      border-radius: var(--glint-border-radius);
      transition: transform var(--glint-duration-fast) var(--glint-easing);
      background: none;
      border: none;
      font: inherit;
      outline: none;
    }

    .star:hover {
      transform: scale(1.15);
    }

    .star:focus-visible {
      box-shadow: 0 0 0 2px var(--glint-color-surface), 0 0 0 4px var(--glint-color-focus-ring);
    }

    .star svg {
      inline-size: 1.5rem;
      block-size: 1.5rem;
    }

    .star.filled svg {
      color: var(--glint-color-warning);
      fill: var(--glint-color-warning);
    }

    .star.empty svg {
      color: var(--glint-color-border);
      fill: none;
    }
  `,
  template: `
    @if (cancel() && !readonly() && !isDisabled()) {
      <button
        class="cancel-icon"
        type="button"
        aria-label="Clear rating"
        tabindex="0"
        (click)="onClear()"
        (keydown.enter)="onClear()"
        (keydown.space)="onClear(); $event.preventDefault()"
      >
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M6 6L14 14M14 6L6 14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    }
    @for (star of starsArray(); track star) {
      <span
        class="star"
        role="radio"
        [class.filled]="isStarFilled(star)"
        [class.empty]="!isStarFilled(star)"
        [attr.aria-checked]="value() === star"
        [attr.aria-label]="star + ' star' + (star > 1 ? 's' : '')"
        [attr.tabindex]="isDisabled() || readonly() ? -1 : 0"
        (click)="onSelect(star)"
        (keydown.enter)="onSelect(star)"
        (keydown.space)="onSelect(star); $event.preventDefault()"
        (keydown.arrowRight)="onArrow(1, $event)"
        (keydown.arrowLeft)="onArrow(-1, $event)"
        (mouseenter)="onStarHover(star)"
      >
        @if (isStarFilled(star)) {
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" stroke="currentColor" stroke-width="1" stroke-linejoin="round"/>
          </svg>
        } @else {
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
          </svg>
        }
      </span>
    }
  `,
})
export class GlintRatingComponent implements ControlValueAccessor {
  /** Total number of stars */
  stars = input(5);
  /** Disabled state */
  disabled = input(false);
  /** Readonly state — full opacity, no interaction */
  readonly = input(false);
  /** Show a cancel/clear icon at the start */
  cancel = input(true);

  protected value = signal(0);
  protected hoverValue = signal(0);

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  protected starsArray = computed(() =>
    Array.from({ length: this.stars() }, (_, i) => i + 1)
  );

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: number) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  protected isStarFilled(star: number): boolean {
    const active = this.hoverValue() || this.value();
    return star <= active;
  }

  writeValue(value: number | null): void {
    this.value.set(value ?? 0);
  }

  registerOnChange(fn: (value: number) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  protected onSelect(star: number): void {
    if (this.isDisabled() || this.readonly()) return;
    this.value.set(star);
    this.onChange(star);
    this.onTouched();
  }

  protected onClear(): void {
    if (this.isDisabled() || this.readonly()) return;
    this.value.set(0);
    this.onChange(0);
    this.onTouched();
  }

  protected onStarHover(star: number): void {
    if (this.isDisabled() || this.readonly()) return;
    this.hoverValue.set(star);
  }

  protected onHostMouseLeave(): void {
    this.hoverValue.set(0);
  }

  protected onArrow(direction: number, event: Event): void {
    if (this.isDisabled() || this.readonly()) return;
    event.preventDefault();
    const current = this.value();
    const next = Math.max(0, Math.min(this.stars(), current + direction));
    this.value.set(next);
    this.onChange(next);
    this.onTouched();
  }
}
