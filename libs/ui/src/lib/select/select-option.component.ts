import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
} from '@angular/core';
import { GLINT_SELECT } from './select.model';

let nextOptionId = 0;

/**
 * Option component for use inside `<glint-select>`.
 *
 * @example
 * ```html
 * <glint-select>
 *   <glint-select-option [value]="'a'">Option A</glint-select-option>
 *   <glint-select-option [value]="'b'" [disabled]="true">Option B</glint-select-option>
 * </glint-select>
 * ```
 */
@Component({
  selector: 'glint-select-option',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'role': 'option',
    '[attr.id]': 'id',
    '[attr.aria-selected]': 'selected()',
    '[attr.aria-disabled]': 'disabled() || null',
    '[class.active]': 'active()',
    '[class.selected]': 'selected()',
    '[class.disabled]': 'disabled()',
    '[style.display]': 'hidden() ? "none" : null',
    '(click)': 'onClick($event)',
  },
  styles: `
    :host {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm, 0.5rem);
      padding-block: var(--glint-spacing-sm, 0.5rem);
      padding-inline: var(--glint-spacing-md, 0.75rem);
      cursor: pointer;
      color: var(--glint-color-text, #1e293b);
      transition:
        background-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease),
        color var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
    }

    :host(:hover:not(.disabled)) {
      background: color-mix(in oklch, var(--glint-color-primary, #3b82f6), transparent 90%);
    }

    :host(.active) {
      background: color-mix(in oklch, var(--glint-color-primary, #3b82f6), transparent 85%);
    }

    :host(.selected) {
      color: var(--glint-color-primary, #3b82f6);
      font-weight: 500;
    }

    :host(.disabled) {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1em;
      block-size: 1em;
      border: 1.5px solid var(--glint-color-border, #e2e8f0);
      border-radius: 2px;
      font-size: 0.75em;
      flex-shrink: 0;
      transition: border-color var(--glint-duration-fast, 100ms) var(--glint-easing, ease);
    }

    :host(.selected) .checkbox {
      background: var(--glint-color-primary, #3b82f6);
      border-color: var(--glint-color-primary, #3b82f6);
      color: var(--glint-color-primary-contrast, #fff);
    }
  `,
  template: `
    @if (showCheckbox()) {
      <span class="checkbox" aria-hidden="true">@if (selected()) {&#10003;}</span>
    }
    <ng-content />
  `,
})
export class GlintSelectOptionComponent {
  /** The value this option represents */
  value = input.required<unknown>();
  /** Whether this option is disabled */
  disabled = input(false);

  /** Unique ID for ARIA */
  readonly id = `glint-option-${nextOptionId++}`;

  private select = inject(GLINT_SELECT);
  private elRef = inject(ElementRef<HTMLElement>);

  /** Whether this option is selected */
  selected = computed(() => this.select.isSelected(this.value()));

  /** Whether this option is the active (keyboard-highlighted) one */
  active = computed(() => this.select.activeOptionId() === this.id);

  /** Whether to show multi-select checkbox */
  showCheckbox = computed(() => this.select.multiple());

  /** Whether this option is hidden by search filter */
  hidden = computed(() => {
    const term = this.select.searchTerm();
    if (!term) return false;
    return !this.viewValue.toLowerCase().includes(term.toLowerCase());
  });

  /** The text content of this option */
  get viewValue(): string {
    return this.elRef.nativeElement.textContent?.trim() ?? '';
  }

  onClick(event: Event): void {
    event.stopPropagation();
    if (!this.disabled()) {
      this.select.selectOption(this.value());
    }
  }
}
