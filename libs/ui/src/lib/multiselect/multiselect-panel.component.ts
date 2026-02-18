import {
  ChangeDetectionStrategy,
  Component,
  computed,
  output,
  signal,
} from '@angular/core';
import { resolveItemLabel } from '../core/utils/label-resolver';
import { filterByLabel } from '../core/utils/filter-utils';

/**
 * Internal panel component rendered inside the CDK overlay for MultiSelect.
 * Not exported from the public API.
 */
@Component({
  selector: 'glint-multiselect-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'multiselect-panel',
  },
  styles: `
    :host {
      display: block;
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
      outline: none;
      overflow: hidden;
    }

    .toggle-all {
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border-block-end: 1px solid var(--glint-color-border);
    }

    .toggle-all-checkbox {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      cursor: pointer;
      font-weight: 500;
      color: var(--glint-color-text);
    }

    .toggle-all-checkbox input[type="checkbox"] {
      accent-color: var(--glint-color-primary);
      cursor: pointer;
    }

    .filter-input {
      display: block;
      inline-size: 100%;
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border: none;
      border-block-end: 1px solid var(--glint-color-border);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      font: inherit;
      outline: none;
      box-sizing: border-box;
    }

    .filter-input:focus {
      border-block-end-color: var(--glint-color-primary);
    }

    .options-container {
      max-block-size: 16rem;
      overflow: auto;
    }

    .option-group-label {
      padding-block: var(--glint-spacing-xs);
      padding-inline: var(--glint-spacing-md);
      font-weight: 600;
      font-size: 0.85em;
      color: var(--glint-color-text-muted);
      user-select: none;
    }

    .option {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-sm);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      cursor: pointer;
      color: var(--glint-color-text);
      transition: background-color var(--glint-duration-fast) var(--glint-easing);
    }

    .option:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    .option.selected {
      color: var(--glint-color-primary);
      font-weight: 500;
    }

    .option-checkbox {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1em;
      block-size: 1em;
      border: 1.5px solid var(--glint-color-border);
      border-radius: 2px;
      font-size: 0.75em;
      flex-shrink: 0;
      transition: border-color var(--glint-duration-fast) var(--glint-easing);
    }

    .option-checkbox.checked {
      background: var(--glint-color-primary);
      border-color: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
    }

    .option-checkbox.checked::after {
      content: '\\2713';
    }

    .empty-message {
      padding: var(--glint-spacing-md);
      text-align: center;
      color: var(--glint-color-text-muted);
      font-size: 0.875em;
    }
  `,
  template: `
    @if (showToggleAll()) {
      <div class="toggle-all">
        <label class="toggle-all-checkbox">
          <input type="checkbox" [checked]="allSelected()" (change)="toggleAll()" />
          Select All
        </label>
      </div>
    }
    @if (showFilter()) {
      <input
        class="filter-input"
        [value]="filterText()"
        (input)="onFilter($event)"
        placeholder="Search..."
      />
    }
    <div class="options-container" role="listbox" aria-multiselectable="true">
      @if (group()) {
        @for (grp of filteredGroups(); track grpLabel(grp)) {
          <div class="option-group-label">{{ grpLabel(grp) }}</div>
          @for (opt of grpChildren(grp); track optValue(opt)) {
            <div
              class="option"
              [class.selected]="isSelected(opt)"
              role="option"
              tabindex="0"
              [attr.aria-selected]="isSelected(opt)"
              (click)="toggleOption(opt)"
              (keydown.enter)="toggleOption(opt)"
              (keydown.space)="toggleOption(opt); $event.preventDefault()"
            >
              <span class="option-checkbox" [class.checked]="isSelected(opt)"></span>
              {{ optLabel(opt) }}
            </div>
          }
        }
      } @else {
        @for (opt of filteredOptions(); track optValue(opt)) {
          <div
            class="option"
            [class.selected]="isSelected(opt)"
            role="option"
            tabindex="0"
            [attr.aria-selected]="isSelected(opt)"
            (click)="toggleOption(opt)"
            (keydown.enter)="toggleOption(opt)"
            (keydown.space)="toggleOption(opt); $event.preventDefault()"
          >
            <span class="option-checkbox" [class.checked]="isSelected(opt)"></span>
            {{ optLabel(opt) }}
          </div>
        }
      }
      @if (noResults()) {
        <div class="empty-message">No options found</div>
      }
    </div>
  `,
})
export class GlintMultiSelectPanelComponent {
  /** Options array */
  readonly options = signal<Record<string, unknown>[]>([]);
  /** Currently selected values */
  readonly selectedValues = signal<unknown[]>([]);
  /** Key for option label */
  readonly optionLabel = signal('label');
  /** Key for option value */
  readonly optionValue = signal('value');
  /** Whether to show the filter input */
  readonly showFilter = signal(true);
  /** Whether to show the toggle-all checkbox */
  readonly showToggleAll = signal(true);
  /** Whether grouping is enabled */
  readonly group = signal(false);
  /** Key for the group label */
  readonly optionGroupLabel = signal('label');
  /** Key for the group children array */
  readonly optionGroupChildren = signal('items');
  /** Current filter text */
  readonly filterText = signal('');

  /** Emitted when selection changes */
  readonly selectionChange = output<unknown[]>();

  /** Filtered flat options (non-grouped mode) */
  readonly filteredOptions = computed(() => {
    const labelKey = this.optionLabel();
    return filterByLabel(this.options(), this.filterText(), opt => resolveItemLabel(opt, labelKey));
  });

  /** Filtered groups (grouped mode) */
  readonly filteredGroups = computed(() => {
    const term = this.filterText();
    const labelKey = this.optionLabel();
    const childrenKey = this.optionGroupChildren();
    const groups = this.options() as Record<string, unknown>[];

    if (!term) return groups;

    return groups
      .map(grp => {
        const children = (grp[childrenKey] as Record<string, unknown>[]) ?? [];
        const filtered = filterByLabel(children, term, opt => resolveItemLabel(opt, labelKey));
        return { ...grp, [childrenKey]: filtered };
      })
      .filter(grp => {
        const children = (grp[childrenKey] as Record<string, unknown>[]) ?? [];
        return children.length > 0;
      });
  });

  /** All visible options across flat or grouped mode */
  private readonly allVisibleOptions = computed<Record<string, unknown>[]>(() => {
    if (this.group()) {
      const childrenKey = this.optionGroupChildren();
      return this.filteredGroups().flatMap(
        grp => (grp[childrenKey] as Record<string, unknown>[]) ?? []
      );
    }
    return this.filteredOptions();
  });

  /** Whether all visible options are selected */
  readonly allSelected = computed(() => {
    const visible = this.allVisibleOptions();
    if (visible.length === 0) return false;
    const valueKey = this.optionValue();
    const selected = this.selectedValues();
    return visible.every(opt => selected.includes(opt[valueKey]));
  });

  /** Whether the filtered results are empty */
  readonly noResults = computed(() => {
    if (this.group()) {
      return this.filteredGroups().length === 0;
    }
    return this.filteredOptions().length === 0;
  });

  /** Helper to get option label */
  optLabel(opt: Record<string, unknown>): string {
    return resolveItemLabel(opt, this.optionLabel());
  }

  /** Helper to get option value */
  optValue(opt: Record<string, unknown>): unknown {
    return opt[this.optionValue()];
  }

  /** Helper to get group label */
  grpLabel(grp: Record<string, unknown>): string {
    return resolveItemLabel(grp, this.optionGroupLabel());
  }

  /** Helper to get group children */
  grpChildren(grp: Record<string, unknown>): Record<string, unknown>[] {
    return (grp[this.optionGroupChildren()] as Record<string, unknown>[]) ?? [];
  }

  /** Check if an option is selected */
  isSelected(opt: Record<string, unknown>): boolean {
    const value = opt[this.optionValue()];
    return this.selectedValues().includes(value);
  }

  /** Toggle a single option */
  toggleOption(opt: Record<string, unknown>): void {
    const value = opt[this.optionValue()];
    const current = this.selectedValues();
    const idx = current.indexOf(value);
    let next: unknown[];
    if (idx >= 0) {
      next = current.filter((_, i) => i !== idx);
    } else {
      next = [...current, value];
    }
    this.selectedValues.set(next);
    this.selectionChange.emit(next);
  }

  /** Toggle all visible options */
  toggleAll(): void {
    const visible = this.allVisibleOptions();
    const valueKey = this.optionValue();

    if (this.allSelected()) {
      // Deselect all visible
      const visibleValues = new Set(visible.map(o => o[valueKey]));
      const next = this.selectedValues().filter(v => !visibleValues.has(v));
      this.selectedValues.set(next);
      this.selectionChange.emit(next);
    } else {
      // Select all visible (keep already selected non-visible)
      const current = new Set(this.selectedValues());
      for (const opt of visible) {
        current.add(opt[valueKey]);
      }
      const next = Array.from(current);
      this.selectedValues.set(next);
      this.selectionChange.emit(next);
    }
  }

  /** Handle filter input */
  onFilter(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.filterText.set(value);
  }
}
