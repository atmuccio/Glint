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
import { GlintMultiSelectPanelComponent } from './multiselect-panel.component';
import { glintId } from '../core/utils/id-generator';
import { GlintIconComponent } from '../icon/icon.component';

/**
 * MultiSelect component with chips, filtering, select all, and grouping.
 *
 * @example
 * ```html
 * <glint-multiselect
 *   [options]="cities"
 *   optionLabel="name"
 *   optionValue="code"
 *   placeholder="Select cities"
 *   [formControl]="citiesCtrl"
 * />
 *
 * <glint-multiselect
 *   [options]="groupedCities"
 *   [group]="true"
 *   optionGroupLabel="name"
 *   optionGroupChildren="cities"
 *   optionLabel="name"
 *   optionValue="code"
 *   display="chip"
 *   [formControl]="citiesCtrl"
 * />
 * ```
 */
@Component({
  selector: 'glint-multiselect',
  standalone: true,
  imports: [GlintIconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.open]': 'isOpen()',
    '[class.disabled]': 'isDisabled()',
  },
  styles: `
    :host {
      display: block;
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .multiselect-trigger {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      padding-block: var(--glint-spacing-sm);
      padding-inline: var(--glint-spacing-md);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      cursor: pointer;
      outline: none;
      min-block-size: 2.5rem;
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing),
        box-shadow var(--glint-duration-normal) var(--glint-easing),
        background-color var(--glint-duration-normal) var(--glint-easing);
    }

    .multiselect-trigger:hover:not(.disabled) {
      border-color: color-mix(in oklch, var(--glint-color-border), black 15%);
    }

    .multiselect-trigger:focus-visible:not(.disabled) {
      border-color: var(--glint-color-focus-ring);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-focus-ring), transparent 70%);
    }

    :host(.open) .multiselect-trigger {
      border-color: var(--glint-color-primary);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-primary), transparent 70%);
    }

    :host(.disabled) .multiselect-trigger {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    .multiselect-label {
      flex: 1;
      min-inline-size: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .multiselect-label.placeholder {
      color: var(--glint-color-text-muted);
    }

    .multiselect-caret {
      flex-shrink: 0;
      font-size: 0.75em;
      transition: transform var(--glint-duration-fast) var(--glint-easing);
    }

    :host(.open) .multiselect-caret {
      transform: rotate(180deg);
    }

    .chips {
      display: flex;
      flex-wrap: wrap;
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
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast);
      font-size: 0.8125em;
      line-height: 1.25;
      white-space: nowrap;
    }

    .chip-remove {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: inherit;
      cursor: pointer;
      font-size: 0.875em;
      padding: 0;
      opacity: 0.7;
      line-height: 1;
      transition: opacity var(--glint-duration-fast) var(--glint-easing);
    }
    .chip-remove:hover {
      opacity: 1;
    }
  `,
  template: `
    <div
      class="multiselect-trigger"
      #triggerEl
      [class.disabled]="isDisabled()"
      tabindex="0"
      role="combobox"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="panelId"
      [attr.aria-disabled]="isDisabled() || null"
      (click)="togglePanel()"
      (keydown)="onTriggerKeydown($event)"
    >
      @if (display() === 'chip' && selectedValues().length) {
        <div class="chips">
          @for (val of selectedValues(); track val) {
            <span class="chip">
              {{ getLabel(val) }}
              <button
                class="chip-remove"
                (click)="removeValue(val, $event)"
                type="button"
                aria-label="Remove"
              >&times;</button>
            </span>
          }
        </div>
      } @else {
        <span
          class="multiselect-label"
          [class.placeholder]="!selectedValues().length"
        >{{ displayText() }}</span>
      }
      <span class="multiselect-caret" aria-hidden="true"><glint-icon name="chevronDown" /></span>
    </div>
  `,
})
export class GlintMultiSelectComponent implements ControlValueAccessor {
  /** Unique panel ID for aria-controls */
  readonly panelId = glintId('glint-multiselect-panel');

  /** Array of option objects */
  readonly options = input.required<Record<string, unknown>[]>();
  /** Property name for option display label */
  readonly optionLabel = input('label');
  /** Property name for option value */
  readonly optionValue = input('value');
  /** Property name for group label (grouped mode) */
  readonly optionGroupLabel = input('label');
  /** Property name for group children array (grouped mode) */
  readonly optionGroupChildren = input('items');
  /** Enable grouped options */
  readonly group = input(false);
  /** Placeholder text when nothing selected */
  readonly placeholder = input('Select...');
  /** Show filter input in panel */
  readonly filter = input(true);
  /** Show "Select All" checkbox in panel */
  readonly showToggleAll = input(true);
  /** How selected items display in the trigger */
  readonly display = input<'comma' | 'chip'>('comma');
  /** Max labels before showing "N items selected" */
  readonly maxSelectedLabels = input(3);
  /** Disabled state from template */
  readonly disabled = input(false);

  /** Emitted when the selection changes */
  readonly selectionChange = output<unknown[]>();

  /** Internal selected values array */
  readonly selectedValues = signal<unknown[]>([]);
  /** Whether the panel is open */
  readonly isOpen = signal(false);
  /** Current filter text */
  readonly filterText = signal('');

  private readonly triggerEl = viewChild.required<ElementRef<HTMLElement>>('triggerEl');

  private readonly overlayService = inject(ZoneAwareOverlayService);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  /** CVA disabled state */
  private readonly disabledFromCVA = signal(false);
  readonly isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  private readonly ngControl = inject(NgControl, { optional: true, self: true });

  private overlayRef: OverlayRef | null = null;
  private onChangeFn: (value: unknown[]) => void = () => { /* noop */ };
  private onTouchedFn: () => void = () => { /* noop */ };

  /** Display text for the trigger (comma mode) */
  readonly displayText = computed(() => {
    const selected = this.selectedValues();
    if (selected.length === 0) return this.placeholder();
    if (selected.length > this.maxSelectedLabels()) {
      return `${selected.length} items selected`;
    }
    return selected.map(v => this.getLabel(v)).join(', ');
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => this.close());
  }

  /** Get label for a value by looking it up in options */
  getLabel(value: unknown): string {
    const labelKey = this.optionLabel();
    const valueKey = this.optionValue();

    if (this.group()) {
      const childrenKey = this.optionGroupChildren();
      for (const grp of this.options()) {
        const children = (grp[childrenKey] as Record<string, unknown>[]) ?? [];
        const found = children.find(opt => opt[valueKey] === value);
        if (found) return resolveItemLabel(found, labelKey);
      }
      return String(value);
    }

    const opt = this.options().find(o => o[valueKey] === value);
    return opt ? resolveItemLabel(opt, labelKey) : String(value);
  }

  /** Remove a value (chip remove button) */
  removeValue(value: unknown, event: Event): void {
    event.stopPropagation();
    const next = this.selectedValues().filter(v => v !== value);
    this.selectedValues.set(next);
    this.onChangeFn(next);
    this.onTouchedFn();
    this.selectionChange.emit(next);
  }

  /** Toggle the overlay panel */
  togglePanel(): void {
    if (this.isDisabled()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  // ── ControlValueAccessor ────────────────────────

  writeValue(value: unknown): void {
    this.selectedValues.set(Array.isArray(value) ? value : []);
  }

  registerOnChange(fn: (value: unknown[]) => void): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouchedFn = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Keyboard ───────────────────────────────────

  onTriggerKeydown(event: KeyboardEvent): void {
    if (this.isDisabled()) return;

    switch (event.key) {
      case 'Enter':
      case ' ':
      case 'ArrowDown':
      case 'ArrowUp':
        event.preventDefault();
        if (!this.isOpen()) {
          this.open();
        }
        break;
      case 'Escape':
        if (this.isOpen()) {
          event.preventDefault();
          this.close();
          this.triggerEl().nativeElement.focus();
        }
        break;
    }
  }

  // ── Open / Close ────────────────────────────────

  private open(): void {
    if (this.isOpen() || this.isDisabled()) return;

    const triggerEl = this.triggerEl().nativeElement;

    const config = createDropdownOverlayConfig(this.overlayService, triggerEl, {
      width: triggerEl.offsetWidth,
    });

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;

    const portal = new ComponentPortal(GlintMultiSelectPanelComponent, null, injector);
    const ref = overlayRef.attach(portal);

    // Set panel inputs imperatively
    const panel = ref.instance;
    panel.options.set(this.options());
    panel.selectedValues.set(this.selectedValues());
    panel.optionLabel.set(this.optionLabel());
    panel.optionValue.set(this.optionValue());
    panel.showFilter.set(this.filter());
    panel.showToggleAll.set(this.showToggleAll());
    panel.group.set(this.group());
    panel.optionGroupLabel.set(this.optionGroupLabel());
    panel.optionGroupChildren.set(this.optionGroupChildren());
    panel.filterText.set(this.filterText());

    // Listen for selection changes
    panel.selectionChange.subscribe((values: unknown[]) => {
      this.selectedValues.set(values);
      this.onChangeFn(values);
      this.onTouchedFn();
      this.selectionChange.emit(values);
    });

    this.isOpen.set(true);

    // Close on backdrop click
    overlayRef.backdropClick().subscribe(() => this.close());

    // Close on Escape
    overlayRef.keydownEvents().subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        this.close();
        this.triggerEl().nativeElement.focus();
      }
    });
  }

  private close(): void {
    if (this.overlayRef) {
      // Capture filter text before disposing
      this.filterText.set('');
      this.overlayRef.dispose();
      this.overlayRef = null;
    }
    this.isOpen.set(false);
  }
}
