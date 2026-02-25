import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  Injector,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { createDropdownOverlayConfig } from '../core/overlay/overlay-config-factory';
import { resolveItemLabel } from '../core/utils/label-resolver';
import { AutoCompletePanelComponent } from './autocomplete-panel.component';
import { glintId } from '../core/utils/id-generator';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * AutoComplete component with suggestion dropdown, single/multiple selection, and CVA.
 *
 * The consumer is responsible for filtering suggestions via the `completeMethod` output.
 *
 * @example
 * ```html
 * <glint-autocomplete
 *   [suggestions]="filteredCountries"
 *   field="name"
 *   placeholder="Search countries..."
 *   (completeMethod)="filterCountries($event)"
 *   [formControl]="countryCtrl"
 * />
 *
 * <glint-autocomplete
 *   [suggestions]="filteredTags"
 *   [multiple]="true"
 *   placeholder="Add tags..."
 *   (completeMethod)="filterTags($event)"
 *   [(ngModel)]="selectedTags"
 * />
 * ```
 */
@Component({
  selector: 'glint-autocomplete',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.open]': 'isOpen()',
    '[class.disabled]': 'isDisabled()',
    '[class.multiple]': 'multiple()',
  },
  styles: `
    :host {
      display: block;
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .autocomplete-wrapper {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      padding-inline: var(--glint-spacing-md);
      box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing);
      min-block-size: 2.5rem;
    }

    .autocomplete-wrapper:hover:not(.disabled) {
      border-color: color-mix(in oklch, var(--glint-color-border), black 15%);
    }

    .autocomplete-wrapper:focus-within:not(.disabled) {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    :host(.open) .autocomplete-wrapper {
      border-color: var(--glint-color-primary);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-primary), transparent 70%);
    }

    .autocomplete-wrapper.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    .autocomplete-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font: inherit;
      color: var(--glint-color-text);
      padding-block: var(--glint-spacing-sm);
      min-inline-size: 4rem;
    }

    .autocomplete-input::placeholder {
      color: var(--glint-color-text-muted);
    }

    .autocomplete-input:disabled {
      cursor: not-allowed;
    }

    /* ── Multiple mode (chips) ───────────────────── */
    .autocomplete-wrapper.multiple {
      flex-wrap: wrap;
      padding-block: var(--glint-spacing-xs);
      gap: var(--glint-spacing-xs);
    }

    .chips-container {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--glint-spacing-xs);
      flex: 1;
      min-inline-size: 0;
    }

    .chip {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      padding-block: 0.125rem;
      padding-inline: 0.5rem;
      border-radius: 9999px;
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
      color: var(--glint-color-text);
      font-size: 0.875em;
      line-height: 1.5;
      white-space: nowrap;
    }

    .chip-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      inline-size: 1rem;
      block-size: 1rem;
      border: none;
      border-radius: 50%;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 0.75rem;
      line-height: 1;
      opacity: 0.6;
      transition: opacity var(--glint-duration-fast) var(--glint-easing);
      padding: 0;
    }

    .chip-remove:hover {
      opacity: 1;
    }

    .chip-remove:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: 1px;
    }

    /* ── Dropdown trigger ────────────────────────── */
    .dropdown-trigger {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      font-size: 0.875em;
      padding: 0;
      inline-size: 1.5rem;
      block-size: 1.5rem;
      border-radius: var(--glint-border-radius);
      transition: color var(--glint-duration-fast) var(--glint-easing);
    }

    .dropdown-trigger:hover {
      color: var(--glint-color-text);
    }
  `,
  template: `
    @if (multiple()) {
      <div class="autocomplete-wrapper multiple" [class.disabled]="isDisabled()">
        <div class="chips-container">
          @for (item of selectedItems(); track itemLabel(item)) {
            <span class="chip">
              {{ itemLabel(item) }}
              <button
                class="chip-remove"
                (click)="removeItem(item)"
                type="button"
                aria-label="Remove"
              >&times;</button>
            </span>
          }
          <input
            #inputEl
            class="autocomplete-input"
            [placeholder]="selectedItems().length === 0 ? placeholder() : ''"
            [disabled]="isDisabled()"
            (input)="onInput($event)"
            (focus)="onFocus()"
            (blur)="onBlur()"
            (keydown)="onKeydown($event)"
            role="combobox"
            [attr.aria-expanded]="isOpen()"
            [attr.aria-controls]="panelId"
            aria-autocomplete="list"
            autocomplete="off"
          />
        </div>
        @if (dropdown()) {
          <button
            class="dropdown-trigger"
            (click)="onDropdownClick()"
            type="button"
            tabindex="-1"
            aria-label="Show suggestions"
          ><glint-icon name="chevronDown" /></button>
        }
      </div>
    } @else {
      <div class="autocomplete-wrapper" [class.disabled]="isDisabled()">
        <input
          #inputEl
          class="autocomplete-input"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          (input)="onInput($event)"
          (focus)="onFocus()"
          (blur)="onBlur()"
          (keydown)="onKeydown($event)"
          role="combobox"
          [attr.aria-expanded]="isOpen()"
          [attr.aria-controls]="panelId"
          aria-autocomplete="list"
          autocomplete="off"
        />
        @if (dropdown()) {
          <button
            class="dropdown-trigger"
            (click)="onDropdownClick()"
            type="button"
            tabindex="-1"
            aria-label="Show suggestions"
          ><glint-icon name="chevronDown" /></button>
        }
      </div>
    }
  `,
})
export class GlintAutoCompleteComponent implements ControlValueAccessor {
  /** Filtered suggestions list — updated by consumer in response to completeMethod */
  suggestions = input<unknown[]>([]);
  /** Property name to display from suggestion objects */
  field = input('label');
  /** Enable multi-select with chips */
  multiple = input(false);
  /** Show a dropdown trigger button */
  dropdown = input(false);
  /** Only allow values from suggestions */
  forceSelection = input(false);
  /** Minimum characters before triggering suggestions */
  minLength = input(1);
  /** Debounce delay in ms */
  delay = input(300);
  /** Placeholder text */
  placeholder = input('');
  /** Disabled state from template */
  disabled = input(false);
  /** Show all suggestions on focus */
  completeOnFocus = input(false);

  /** Emitted when the consumer should filter/fetch suggestions */
  completeMethod = output<{ query: string }>();
  /** Emitted when a suggestion is selected */
  itemSelect = output<unknown>();
  /** Emitted when a chip is removed (multiple mode) */
  itemUnselect = output<unknown>();

  /** Internal state */
  readonly query = signal('');
  readonly isOpen = signal(false);
  readonly selectedItems = signal<unknown[]>([]);

  private readonly inputEl = viewChild<ElementRef<HTMLInputElement>>('inputEl');

  private readonly overlayService = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly elRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  readonly inputId = glintId('glint-autocomplete');
  readonly panelId = `${this.inputId}-panel`;

  /** CVA state */
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private ngControl = inject(NgControl, { optional: true, self: true });
  private onChange: (value: unknown) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  /** Overlay */
  private overlayRef: OverlayRef | null = null;
  private panelInstance: AutoCompletePanelComponent | null = null;
  private highlightIndex = signal(-1);
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  /** Computed selected value for single mode */
  private selectedValue = signal<unknown>(null);

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => {
      this.closePanel();
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
    });
  }

  // ── ControlValueAccessor ────────────────────────

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.selectedItems.set(Array.isArray(value) ? [...value] : []);
      this.query.set('');
      this.setInputValue('');
    } else {
      this.selectedValue.set(value);
      if (value != null) {
        const label = this.itemLabel(value);
        this.query.set(label);
        this.setInputValue(label);
      } else {
        this.query.set('');
        this.setInputValue('');
      }
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

  // ── Helpers ────────────────────────────────────

  /** Get display label from a suggestion item */
  itemLabel(item: unknown): string {
    return resolveItemLabel(item, this.field());
  }

  private setInputValue(value: string): void {
    const el = this.inputEl()?.nativeElement;
    if (el) {
      el.value = value;
    }
  }

  private emitValue(): void {
    if (this.multiple()) {
      this.onChange([...this.selectedItems()]);
    } else {
      this.onChange(this.selectedValue());
    }
  }

  // ── Event handlers ─────────────────────────────

  onInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.query.set(value);

    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }

    if (value.length >= this.minLength()) {
      this.debounceTimer = setTimeout(() => {
        this.completeMethod.emit({ query: value });
      }, this.delay());
    } else {
      this.closePanel();
    }

    // In single mode without forceSelection, update value as typed
    if (!this.multiple() && !this.forceSelection()) {
      this.selectedValue.set(value || null);
      this.emitValue();
    }
  }

  onFocus(): void {
    if (this.isDisabled()) return;
    if (this.completeOnFocus()) {
      this.completeMethod.emit({ query: this.query() });
    }
  }

  onBlur(): void {
    this.onTouched();

    // forceSelection: if text doesn't match a suggestion, clear it
    if (this.forceSelection() && !this.multiple()) {
      const currentQuery = this.inputEl()?.nativeElement?.value ?? '';
      if (currentQuery) {
        const match = this.suggestions().find(
          (s) => this.itemLabel(s).toLowerCase() === currentQuery.toLowerCase()
        );
        if (!match) {
          this.query.set('');
          this.setInputValue('');
          this.selectedValue.set(null);
          this.emitValue();
        }
      }
    }

    // Delay close to allow click events on panel items to fire first
    setTimeout(() => {
      this.closePanel();
    }, 200);
  }

  onKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.isOpen()) {
          this.completeMethod.emit({ query: this.query() });
        } else {
          this.moveHighlight(1);
        }
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (this.isOpen()) {
          this.moveHighlight(-1);
        }
        break;

      case 'Enter':
        event.preventDefault();
        if (this.isOpen() && this.highlightIndex() >= 0) {
          const items = this.suggestions();
          if (this.highlightIndex() < items.length) {
            this.selectItem(items[this.highlightIndex()]);
          }
        }
        break;

      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.closePanel();
        }
        break;

      case 'Backspace':
        if (this.multiple()) {
          const inputValue = this.inputEl()?.nativeElement?.value ?? '';
          if (inputValue === '') {
            const items = this.selectedItems();
            if (items.length > 0) {
              this.removeItem(items[items.length - 1]);
            }
          }
        }
        break;
    }
  }

  onDropdownClick(): void {
    if (this.isDisabled()) return;
    if (this.isOpen()) {
      this.closePanel();
    } else {
      this.completeMethod.emit({ query: this.query() });
      // Focus input after dropdown click
      this.inputEl()?.nativeElement?.focus();
    }
  }

  // ── Selection ──────────────────────────────────

  selectItem(item: unknown): void {
    if (this.multiple()) {
      const current = this.selectedItems();
      const label = this.itemLabel(item);
      const alreadySelected = current.some(
        (s) => this.itemLabel(s) === label
      );
      if (!alreadySelected) {
        this.selectedItems.set([...current, item]);
        this.itemSelect.emit(item);
      }
      this.query.set('');
      this.setInputValue('');
      this.emitValue();
      // Keep the panel open if there's still a query context
      this.closePanel();
      this.inputEl()?.nativeElement?.focus();
    } else {
      const label = this.itemLabel(item);
      this.selectedValue.set(item);
      this.query.set(label);
      this.setInputValue(label);
      this.emitValue();
      this.itemSelect.emit(item);
      this.closePanel();
    }
  }

  removeItem(item: unknown): void {
    const label = this.itemLabel(item);
    const updated = this.selectedItems().filter(
      (s) => this.itemLabel(s) !== label
    );
    this.selectedItems.set(updated);
    this.itemUnselect.emit(item);
    this.emitValue();
  }

  // ── Panel management ───────────────────────────

  /** Called when suggestions input changes. Opens panel if suggestions are available. */
  openPanel(): void {
    if (this.isDisabled()) return;
    const items = this.suggestions();

    if (this.isOpen() && this.panelInstance) {
      // Update existing panel
      this.panelInstance.suggestions.set(items);
      this.highlightIndex.set(items.length > 0 ? 0 : -1);
      this.panelInstance.highlightIndex.set(this.highlightIndex());
      return;
    }

    if (items.length === 0) return;

    const wrapperEl = this.elRef.nativeElement.querySelector('.autocomplete-wrapper') as HTMLElement;
    if (!wrapperEl) return;

    const config = createDropdownOverlayConfig(this.overlayService, wrapperEl, {
      width: wrapperEl.offsetWidth,
      hasBackdrop: false,
    });

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;

    const portal = new ComponentPortal(AutoCompletePanelComponent, null, injector);
    const ref = overlayRef.attach(portal);
    this.panelInstance = ref.instance;
    this.panelInstance.suggestions.set(items);
    this.panelInstance.labelFn = (item: unknown) => this.itemLabel(item);
    this.highlightIndex.set(items.length > 0 ? 0 : -1);
    this.panelInstance.highlightIndex.set(this.highlightIndex());

    this.panelInstance.itemSelected.subscribe((item: unknown) => {
      this.selectItem(item);
    });

    this.isOpen.set(true);
  }

  closePanel(): void {
    if (!this.isOpen()) return;
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.panelInstance = null;
    this.isOpen.set(false);
    this.highlightIndex.set(-1);
  }

  private moveHighlight(direction: number): void {
    const items = this.suggestions();
    if (items.length === 0) return;

    let newIndex = this.highlightIndex() + direction;
    if (newIndex < 0) newIndex = 0;
    if (newIndex >= items.length) newIndex = items.length - 1;

    this.highlightIndex.set(newIndex);
    if (this.panelInstance) {
      this.panelInstance.highlightIndex.set(newIndex);
      this.panelInstance.scrollHighlightedIntoView();
    }
  }
}
