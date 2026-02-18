import {
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

/**
 * ListBox component with single/multiple selection and CVA support.
 *
 * @example
 * ```html
 * <glint-listbox
 *   [options]="cities"
 *   optionLabel="name"
 *   optionValue="code"
 *   [formControl]="cityCtrl"
 * />
 *
 * <glint-listbox
 *   [options]="items"
 *   [multiple]="true"
 *   [filter]="true"
 *   [formControl]="selectedCtrl"
 * />
 * ```
 */
@Component({
  selector: 'glint-listbox',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      color: var(--glint-color-text);
    }

    :host(.disabled) {
      opacity: 0.6;
      pointer-events: none;
    }

    .listbox-wrapper {
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      overflow: hidden;
    }

    .filter-input {
      display: block;
      inline-size: 100%;
      padding: var(--glint-spacing-sm) var(--glint-spacing-md);
      border: none;
      border-block-end: 1px solid var(--glint-color-border);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
      box-sizing: border-box;
    }

    .filter-input::placeholder {
      color: var(--glint-color-text-muted);
    }

    .filter-input:focus {
      box-shadow: inset 0 -2px 0 var(--glint-color-primary);
    }

    .list {
      max-block-size: 15rem;
      overflow-y: auto;
    }

    .option {
      display: flex;
      align-items: center;
      padding: var(--glint-spacing-sm) var(--glint-spacing-md);
      cursor: pointer;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing),
        color var(--glint-duration-fast) var(--glint-easing);
      user-select: none;
      outline: none;
    }

    .option:hover:not(.selected) {
      background: color-mix(in oklch, var(--glint-color-surface), var(--glint-color-primary) 8%);
    }

    .option:focus-visible {
      box-shadow: inset 0 0 0 2px var(--glint-color-focus-ring);
    }

    .option.selected {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
    }

    .option.selected:hover {
      background: color-mix(in oklch, var(--glint-color-primary), black 10%);
    }
  `,
  template: `
    <div class="listbox-wrapper">
      @if (filter()) {
        <input
          #filterInput
          class="filter-input"
          type="text"
          placeholder="Search..."
          [value]="filterText()"
          (input)="onFilterInput($event)"
        />
      }
      <div
        #listEl
        class="list"
        role="listbox"
        [attr.aria-multiselectable]="multiple() || null"
        [style]="listStyle()"
        tabindex="-1"
        (keydown)="onKeydown($event)"
      >
        @for (option of filteredOptions(); track getOptionValue(option)) {
          <div
            class="option"
            role="option"
            [class.selected]="isSelected(option)"
            [attr.aria-selected]="isSelected(option)"
            [attr.data-value]="getOptionValue(option)"
            tabindex="0"
            (click)="onSelect(option)"
            (keydown.enter)="onSelect(option); $event.preventDefault()"
            (keydown.space)="onSelect(option); $event.preventDefault()"
          >{{ getOptionLabel(option) }}</div>
        }
      </div>
    </div>
  `,
})
export class GlintListboxComponent implements ControlValueAccessor {
  /** Array of option objects */
  options = input.required<Record<string, unknown>[]>();
  /** Key to display as option label */
  optionLabel = input('label');
  /** Key to use as option value */
  optionValue = input('value');
  /** Enable multi-select mode */
  multiple = input(false);
  /** Disabled state from template */
  disabled = input(false);
  /** Show filter input at top */
  filter = input(false);
  /** Inline style for list container (e.g. max-height) */
  listStyle = input<string | undefined>(undefined);

  /** Internal selected values */
  protected selectedValues = signal<unknown[]>([]);
  /** Filter search text */
  protected filterText = signal('');

  private listEl = viewChild<ElementRef<HTMLElement>>('listEl');

  /** Filtered options based on filterText */
  filteredOptions = computed(() => {
    const text = this.filterText().toLowerCase();
    const opts = this.options();
    const labelKey = this.optionLabel();
    if (!text) return opts;
    return opts.filter(opt => {
      const label = String(opt[labelKey] ?? '').toLowerCase();
      return label.includes(text);
    });
  });

  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: unknown) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  // ── ControlValueAccessor ─────────────────────

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.selectedValues.set(Array.isArray(value) ? value : []);
    } else {
      this.selectedValues.set(value != null ? [value] : []);
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Helpers ──────────────────────────────────

  getOptionLabel(option: Record<string, unknown>): string {
    return String(option[this.optionLabel()] ?? '');
  }

  getOptionValue(option: Record<string, unknown>): unknown {
    return option[this.optionValue()];
  }

  isSelected(option: Record<string, unknown>): boolean {
    const val = this.getOptionValue(option);
    return this.selectedValues().includes(val);
  }

  // ── Event handlers ───────────────────────────

  protected onSelect(option: Record<string, unknown>): void {
    if (this.isDisabled()) return;

    const val = this.getOptionValue(option);

    if (this.multiple()) {
      const current = this.selectedValues();
      const idx = current.indexOf(val);
      if (idx >= 0) {
        this.selectedValues.set(current.filter((_, i) => i !== idx));
      } else {
        this.selectedValues.set([...current, val]);
      }
      this.onChange(this.selectedValues());
    } else {
      this.selectedValues.set([val]);
      this.onChange(val);
    }
    this.onTouched();
  }

  protected onFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
  }

  protected onKeydown(event: KeyboardEvent): void {
    const listEl = this.listEl()?.nativeElement;
    if (!listEl) return;

    const options = Array.from(listEl.querySelectorAll('.option')) as HTMLElement[];
    if (options.length === 0) return;

    const focused = listEl.querySelector('.option:focus') as HTMLElement | null;
    const currentIndex = focused ? options.indexOf(focused) : -1;

    switch (event.key) {
      case 'ArrowDown': {
        event.preventDefault();
        const next = Math.min(currentIndex + 1, options.length - 1);
        options[next].focus();
        break;
      }
      case 'ArrowUp': {
        event.preventDefault();
        const prev = Math.max(currentIndex - 1, 0);
        options[prev].focus();
        break;
      }
      case 'Home': {
        event.preventDefault();
        options[0].focus();
        break;
      }
      case 'End': {
        event.preventDefault();
        options[options.length - 1].focus();
        break;
      }
      case 'a':
      case 'A': {
        if (event.ctrlKey && this.multiple()) {
          event.preventDefault();
          const allValues = this.filteredOptions().map(o => this.getOptionValue(o));
          this.selectedValues.set(allValues);
          this.onChange(this.selectedValues());
          this.onTouched();
        }
        break;
      }
    }
  }
}
