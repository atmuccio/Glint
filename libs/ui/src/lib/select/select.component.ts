import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
  contentChildren,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  signal,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntil } from 'rxjs';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { GLINT_SELECT, GlintSelectHost, DEFAULT_COMPARE_WITH, CompareWithFn } from './select.model';
import { GlintSelectOptionComponent } from './select-option.component';

let nextId = 0;

/**
 * Select component with single/multi-select, search, keyboard navigation, and CVA.
 *
 * @example
 * ```html
 * <glint-select placeholder="Choose a fruit" [formControl]="fruitCtrl">
 *   <glint-select-option [value]="'apple'">Apple</glint-select-option>
 *   <glint-select-option [value]="'banana'">Banana</glint-select-option>
 * </glint-select>
 *
 * <glint-select [multiple]="true" [searchable]="true" placeholder="Tags">
 *   <glint-select-option [value]="'a'">Alpha</glint-select-option>
 *   <glint-select-option [value]="'b'">Beta</glint-select-option>
 * </glint-select>
 * ```
 */
@Component({
  selector: 'glint-select',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './select.component.css',
  host: {
    '[attr.data-size]': 'size()',
    '[class.open]': 'isOpen()',
    '[class.disabled]': 'isDisabled()',
  },
  providers: [
    {
      provide: GLINT_SELECT,
      useExisting: forwardRef(() => GlintSelectComponent),
    },
  ],
  template: `
    <div
      class="trigger"
      #triggerEl
      role="combobox"
      tabindex="0"
      [attr.aria-expanded]="isOpen()"
      [attr.aria-haspopup]="'listbox'"
      [attr.aria-controls]="panelId"
      [attr.aria-activedescendant]="activeOptionId()"
      [attr.aria-disabled]="isDisabled() || null"
      [class.disabled]="isDisabled()"
      (click)="toggle()"
      (keydown)="onTriggerKeydown($event)"
    >
      @if (displayText()) {
        <span class="value-text">{{ displayText() }}</span>
      } @else {
        <span class="value-text placeholder">{{ placeholder() }}</span>
      }
      <span class="arrow" aria-hidden="true">&#9662;</span>
    </div>

    <ng-template #panelTemplate>
      <div
        class="select-panel"
        role="listbox"
        [id]="panelId"
        tabindex="-1"
        [attr.aria-multiselectable]="multiple() || null"
        (keydown)="onPanelKeydown($event)"
      >
        @if (searchable()) {
          <div class="search-wrapper">
            <input
              class="search-input"
              type="text"
              placeholder="Search..."
              [value]="searchTerm()"
              (input)="onSearchInput($event)"
              #searchInput
            />
          </div>
        }
        <ng-content />
        @if (visibleOptions().length === 0) {
          <div class="empty-message">No options found</div>
        }
      </div>
    </ng-template>
  `,
})
export class GlintSelectComponent implements ControlValueAccessor, GlintSelectHost {
  /** Placeholder text when no value selected */
  placeholder = input('');
  /** Size */
  size = input<'sm' | 'md' | 'lg'>('md');
  /** Enable multi-select mode */
  multiple = input(false);
  /** Enable search/filter input in dropdown */
  searchable = input(false);
  /** Disabled state from template */
  disabled = input(false);
  /** Custom comparison function for option values */
  compareWith = input<CompareWithFn>(DEFAULT_COMPARE_WITH);

  /** Content-projected options */
  options = contentChildren(GlintSelectOptionComponent);

  private panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  private triggerEl = viewChild.required<ElementRef<HTMLElement>>('triggerEl');

  private overlayService = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private vcr = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);

  readonly panelId = `glint-select-panel-${nextId++}`;

  /** Whether the dropdown panel is open */
  readonly isOpen = signal(false);
  /** Current search/filter term */
  readonly searchTerm = signal('');
  /** Currently active (keyboard-highlighted) option ID */
  readonly activeOptionId = signal<string | null>(null);

  /** Internal selected value(s) */
  private selectedValue = signal<unknown>(null);
  private selectedValues = signal<unknown[]>([]);

  /** CVA disabled state */
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  /**
   * NgControl injected directly (no NG_VALUE_ACCESSOR provider needed).
   * This avoids circular dependency and matches the Input component pattern.
   */
  private ngControl = inject(NgControl, { optional: true, self: true });

  private overlayRef: OverlayRef | null = null;
  private onChange: (value: unknown) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  /** Visible (non-hidden) options for empty state detection */
  visibleOptions = computed(() => {
    return this.options().filter(opt => !opt.hidden());
  });

  /** Display text for the trigger */
  displayText = computed(() => {
    const opts = this.options();
    if (this.multiple()) {
      const selected = opts.filter(o => this.isSelected(o.value()));
      return selected.map(o => o.viewValue).join(', ');
    }
    const selected = opts.find(o => this.isSelected(o.value()));
    return selected?.viewValue ?? '';
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => this.close());
  }

  // ── GlintSelectHost interface ───────────────────

  isSelected(value: unknown): boolean {
    const cmp = this.compareWith();
    if (this.multiple()) {
      return this.selectedValues().some(v => cmp(v, value));
    }
    return cmp(this.selectedValue(), value);
  }

  selectOption(value: unknown): void {
    if (this.multiple()) {
      const cmp = this.compareWith();
      const current = this.selectedValues();
      const idx = current.findIndex(v => cmp(v, value));
      if (idx >= 0) {
        this.selectedValues.set(current.filter((_, i) => i !== idx));
      } else {
        this.selectedValues.set([...current, value]);
      }
      this.onChange(this.selectedValues());
    } else {
      this.selectedValue.set(value);
      this.onChange(value);
      this.close();
    }
    this.onTouched();
  }

  // ── ControlValueAccessor ────────────────────────

  writeValue(value: unknown): void {
    if (this.multiple()) {
      this.selectedValues.set(Array.isArray(value) ? value : []);
    } else {
      this.selectedValue.set(value);
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

  // ── Open / Close ────────────────────────────────

  toggle(): void {
    if (this.isDisabled()) return;
    if (this.isOpen()) { this.close(); } else { this.open(); }
  }

  open(): void {
    if (this.isOpen() || this.isDisabled()) return;

    const triggerEl = this.triggerEl().nativeElement;

    const config = new OverlayConfig({
      positionStrategy: this.overlayService
        .position()
        .flexibleConnectedTo(triggerEl)
        .withPositions([
          { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
          { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
        ])
        .withPush(true),
      scrollStrategy: this.overlayService.scrollStrategies.reposition(),
      width: triggerEl.offsetWidth,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
    });

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.panelTemplate(), this.vcr, undefined, injector);
    overlayRef.attach(portal);

    this.isOpen.set(true);
    this.searchTerm.set('');

    // Set initial active option
    const visible = this.visibleOptions();
    if (visible.length > 0) {
      this.activeOptionId.set(visible[0].id);
    }

    // Focus search input if searchable
    if (this.searchable()) {
      afterNextRender(() => {
        const searchEl = overlayRef.overlayElement.querySelector('.search-input') as HTMLInputElement;
        searchEl?.focus();
      }, { injector: this.injector });
    }

    // Close on backdrop click
    overlayRef.backdropClick().pipe(takeUntil(overlayRef.detachments())).subscribe(() => this.close());
  }

  close(): void {
    if (!this.isOpen()) return;
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
    this.activeOptionId.set(null);
    this.searchTerm.set('');
  }

  // ── Keyboard navigation ─────────────────────────

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

  onPanelKeydown(event: KeyboardEvent): void {
    const visible = this.visibleOptions();
    if (visible.length === 0) return;

    const activeId = this.activeOptionId();
    const activeIdx = visible.findIndex(o => o.id === activeId);

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.setActiveByIndex(visible, Math.min(activeIdx + 1, visible.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.setActiveByIndex(visible, Math.max(activeIdx - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        this.setActiveByIndex(visible, 0);
        break;
      case 'End':
        event.preventDefault();
        this.setActiveByIndex(visible, visible.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (activeIdx >= 0 && !visible[activeIdx].disabled()) {
          this.selectOption(visible[activeIdx].value());
        }
        break;
      case 'Escape':
        event.preventDefault();
        this.close();
        this.triggerEl().nativeElement.focus();
        break;
    }
  }

  onSearchInput(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchTerm.set(value);
    // Reset active to first visible option
    const visible = this.visibleOptions();
    this.activeOptionId.set(visible.length > 0 ? visible[0].id : null);
  }

  private setActiveByIndex(
    visible: readonly GlintSelectOptionComponent[],
    index: number
  ): void {
    if (index >= 0 && index < visible.length) {
      this.activeOptionId.set(visible[index].id);
      // Scroll active option into view (guard for jsdom)
      const el = document.getElementById(visible[index].id);
      if (el && typeof el.scrollIntoView === 'function') {
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }
}
