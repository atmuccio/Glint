import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CdkListbox, CdkOption, ListboxValueChangeEvent } from '@angular/cdk/listbox';
import { resolveItemLabel } from '../core/utils/label-resolver';
import { filterByLabel } from '../core/utils/filter-utils';

/**
 * ListBox component with single/multiple selection, CDK keyboard navigation,
 * typeahead, aria-activedescendant, and CVA support.
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
  imports: [CdkListbox, CdkOption],
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

    .option.cdk-option-active:not(.selected) {
      background: color-mix(in oklch, var(--glint-color-surface), var(--glint-color-primary) 12%);
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
          class="filter-input"
          type="text"
          placeholder="Search..."
          [value]="filterText()"
          (input)="onFilterInput($event)"
        />
      }
      <div
        class="list"
        cdkListbox
        [cdkListboxMultiple]="multiple()"
        [cdkListboxDisabled]="isDisabled()"
        [cdkListboxUseActiveDescendant]="true"
        [cdkListboxValue]="selectedValues()"
        [style]="listStyle()"
        (cdkListboxValueChange)="onCdkValueChange($event)"
      >
        @for (option of filteredOptions(); track getOptionValue(option)) {
          <div
            class="option"
            [cdkOption]="getOptionValue(option)"
            [cdkOptionTypeaheadLabel]="getOptionLabel(option)"
            [class.selected]="isSelected(option)"
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

  /** Filtered options based on filterText */
  filteredOptions = computed(() => {
    const labelKey = this.optionLabel();
    return filterByLabel(this.options(), this.filterText(), opt => resolveItemLabel(opt, labelKey));
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

  // ── CDK event handler ──────────────────────────

  protected onCdkValueChange(event: ListboxValueChangeEvent<unknown>): void {
    const values = event.value as unknown[];

    this.selectedValues.set([...values]);

    if (this.multiple()) {
      this.onChange([...values]);
    } else {
      this.onChange(values.length > 0 ? values[0] : null);
    }
    this.onTouched();
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
    return resolveItemLabel(option, this.optionLabel());
  }

  getOptionValue(option: Record<string, unknown>): unknown {
    return option[this.optionValue()];
  }

  isSelected(option: Record<string, unknown>): boolean {
    const val = this.getOptionValue(option);
    return this.selectedValues().includes(val);
  }

  // ── Event handlers ───────────────────────────

  protected onFilterInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
  }
}
