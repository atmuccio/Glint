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
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { takeUntil } from 'rxjs';
import { ZoneAwareOverlayService } from '../core/overlay/zone-aware-overlay.service';
import { createDropdownOverlayConfig } from '../core/overlay/overlay-config-factory';
import { GlintDatepickerPanelComponent } from './datepicker-panel.component';
import { glintId } from '../core/utils/id-generator';

/**
 * Date picker with calendar dropdown, ControlValueAccessor support,
 * and multiple selection modes (single, range, multiple).
 *
 * @example
 * ```html
 * <glint-datepicker placeholder="Select a date" [formControl]="dateCtrl" />
 * <glint-datepicker selectionMode="range" [showButtonBar]="true" />
 * <glint-datepicker [inline]="true" [numberOfMonths]="2" />
 * ```
 */
@Component({
  selector: 'glint-datepicker',
  standalone: true,
  imports: [GlintDatepickerPanelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.open]': 'isOpen()',
    '[class.disabled]': 'isDisabled()',
    '[class.inline-mode]': 'inline()',
  },
  styles: `
    :host {
      display: block;
      position: relative;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .datepicker-trigger {
      display: flex;
      align-items: center;
      gap: var(--glint-spacing-xs);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      padding-inline: var(--glint-spacing-md);
      min-block-size: 2.5rem;
      transition:
        border-color var(--glint-duration-normal) var(--glint-easing-standard, ease),
        box-shadow var(--glint-duration-normal) var(--glint-easing-standard, ease);
    }

    .datepicker-trigger:hover:not(.disabled) {
      border-color: color-mix(in oklch, var(--glint-color-border), black 15%);
    }

    :host(.open) .datepicker-trigger {
      border-color: var(--glint-color-primary);
      box-shadow: 0 0 0 2px color-mix(in oklch, var(--glint-color-primary), transparent 70%);
    }

    .datepicker-trigger.disabled {
      opacity: 0.6;
      cursor: not-allowed;
      pointer-events: none;
    }

    .datepicker-input {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      font: inherit;
      color: var(--glint-color-text);
      padding-block: var(--glint-spacing-sm);
      min-inline-size: 0;
    }

    .datepicker-input::placeholder {
      color: var(--glint-color-text-muted);
    }

    .datepicker-input:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .datepicker-icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--glint-color-text-muted);
      cursor: pointer;
      padding: var(--glint-spacing-xs);
      border-radius: var(--glint-border-radius);
      font-size: 1em;
      line-height: 1;
      transition: color var(--glint-duration-fast) var(--glint-easing-standard, ease);
    }

    .datepicker-icon:hover {
      color: var(--glint-color-text);
    }

    .datepicker-icon:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    :host(.inline-mode) .datepicker-trigger {
      display: none;
    }
  `,
  template: `
    @if (!inline()) {
      <div class="datepicker-trigger" #triggerEl [class.disabled]="isDisabled()">
        <input
          class="datepicker-input"
          [id]="inputId"
          [value]="formattedValue()"
          [placeholder]="placeholder()"
          [disabled]="isDisabled()"
          [readOnly]="readonlyInput()"
          (input)="onInputChange($event)"
          (click)="openPanel()"
          (keydown)="onKeydown($event)"
        />
        @if (showIcon()) {
          <button
            class="datepicker-icon"
            (click)="togglePanel()"
            type="button"
            tabindex="-1"
            aria-label="Open calendar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </button>
        }
      </div>
    }

    @if (inline()) {
      <glint-datepicker-panel
        [value]="selectedValue()"
        [selectionMode]="selectionMode()"
        [showTime]="showTime()"
        [hourFormat]="hourFormat()"
        [showButtonBar]="showButtonBar()"
        [numberOfMonths]="numberOfMonths()"
        [firstDayOfWeek]="firstDayOfWeek()"
        [minDate]="minDate()"
        [maxDate]="maxDate()"
        (dateSelect)="onDateSelect($event)"
        (clearValue)="onClearValue()"
      />
    }

    <ng-template #panelTemplate>
      <glint-datepicker-panel
        [value]="selectedValue()"
        [selectionMode]="selectionMode()"
        [showTime]="showTime()"
        [hourFormat]="hourFormat()"
        [showButtonBar]="showButtonBar()"
        [numberOfMonths]="numberOfMonths()"
        [firstDayOfWeek]="firstDayOfWeek()"
        [minDate]="minDate()"
        [maxDate]="maxDate()"
        (dateSelect)="onDateSelect($event)"
        (monthChange)="monthChange.emit($event)"
        (clearValue)="onClearValue()"
      />
    </ng-template>
  `,
})
export class GlintDatepickerComponent implements ControlValueAccessor {
  /** Selection mode */
  selectionMode = input<'single' | 'range' | 'multiple'>('single');
  /** Date display format: 'dd'=day, 'mm'=month, 'yy'=year */
  dateFormat = input('mm/dd/yy');
  /** Placeholder text */
  placeholder = input('');
  /** Show calendar icon button */
  showIcon = input(true);
  /** Show calendar inline (no overlay) */
  inline = input(false);
  /** Show time picker */
  showTime = input(false);
  /** Hour format */
  hourFormat = input<'12' | '24'>('24');
  /** Minimum selectable date */
  minDate = input<Date | null>(null);
  /** Maximum selectable date */
  maxDate = input<Date | null>(null);
  /** Show Today/Clear button bar */
  showButtonBar = input(false);
  /** Number of months to show side by side */
  numberOfMonths = input(1);
  /** First day of week (0=Sunday, 1=Monday, ...) */
  firstDayOfWeek = input(0);
  /** Disabled state from template */
  disabled = input(false);
  /** Read-only input */
  readonlyInput = input(false);

  /** Emitted when a date is selected */
  dateSelect = output<Date>();
  /** Emitted when the current month changes */
  monthChange = output<{ month: number; year: number }>();

  readonly inputId = glintId('glint-datepicker');

  /** Whether the overlay panel is open */
  readonly isOpen = signal(false);

  /** Internal selected value */
  readonly selectedValue = signal<Date | Date[] | null>(null);

  /** CVA disabled state */
  private disabledFromCVA = signal(false);
  isDisabled = computed(() => this.disabled() || this.disabledFromCVA());

  /** Formatted display value */
  formattedValue = computed(() => {
    const val = this.selectedValue();
    if (!val) return '';
    const fmt = this.dateFormat();
    if (Array.isArray(val)) {
      if (this.selectionMode() === 'range' && val.length === 2) {
        return `${this.formatDate(val[0], fmt)} - ${this.formatDate(val[1], fmt)}`;
      }
      return val.map(d => this.formatDate(d, fmt)).join(', ');
    }
    return this.formatDate(val, fmt);
  });

  private panelTemplate = viewChild.required<TemplateRef<unknown>>('panelTemplate');
  private triggerEl = viewChild<ElementRef<HTMLElement>>('triggerEl');

  private overlayService = inject(ZoneAwareOverlayService);
  private injector = inject(Injector);
  private vcr = inject(ViewContainerRef);
  private destroyRef = inject(DestroyRef);
  private ngControl = inject(NgControl, { optional: true, self: true });

  private overlayRef: OverlayRef | null = null;
  private onChange: (value: Date | Date[] | null) => void = () => { /* noop */ };
  private onTouched: () => void = () => { /* noop */ };

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this.destroyRef.onDestroy(() => this.close());
  }

  // ── ControlValueAccessor ────────────────────────

  writeValue(value: Date | Date[] | null): void {
    this.selectedValue.set(value);
  }

  registerOnChange(fn: (value: Date | Date[] | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabledFromCVA.set(isDisabled);
  }

  // ── Panel open / close ──────────────────────────

  openPanel(): void {
    if (this.isOpen() || this.isDisabled() || this.inline()) return;
    this.open();
  }

  togglePanel(): void {
    if (this.isDisabled() || this.inline()) return;
    if (this.isOpen()) {
      this.close();
    } else {
      this.open();
    }
  }

  // ── Event handlers ──────────────────────────────

  onInputChange(event: Event): void {
    if (this.readonlyInput()) return;
    const raw = (event.target as HTMLInputElement).value;
    const parsed = this.parseDate(raw, this.dateFormat());
    if (parsed) {
      this.selectedValue.set(parsed);
      this.onChange(parsed);
      this.dateSelect.emit(parsed);
    }
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.close();
    } else if (event.key === 'Enter' || event.key === 'ArrowDown') {
      event.preventDefault();
      this.openPanel();
    }
  }

  onDateSelect(date: Date): void {
    const mode = this.selectionMode();
    if (mode === 'single') {
      this.selectedValue.set(date);
      this.onChange(date);
      this.dateSelect.emit(date);
      this.close();
    } else if (mode === 'multiple') {
      const current = (this.selectedValue() as Date[]) ?? [];
      const existing = current.findIndex(d => this.isSameDay(d, date));
      let updated: Date[];
      if (existing >= 0) {
        updated = current.filter((_, i) => i !== existing);
      } else {
        updated = [...current, date];
      }
      this.selectedValue.set(updated);
      this.onChange(updated);
      this.dateSelect.emit(date);
    } else if (mode === 'range') {
      const current = (this.selectedValue() as Date[]) ?? [];
      let updated: Date[];
      if (current.length === 0 || current.length === 2) {
        updated = [date];
      } else {
        // Second click completes the range
        const start = current[0];
        if (date < start) {
          updated = [date, start];
        } else {
          updated = [start, date];
        }
      }
      this.selectedValue.set(updated);
      this.onChange(updated);
      this.dateSelect.emit(date);
      if (updated.length === 2) {
        this.close();
      }
    }
    this.onTouched();
  }

  onClearValue(): void {
    this.selectedValue.set(null);
    this.onChange(null);
    this.onTouched();
  }

  // ── Private ─────────────────────────────────────

  private open(): void {
    const trigger = this.triggerEl()?.nativeElement;
    if (!trigger) return;

    const config = createDropdownOverlayConfig(this.overlayService, trigger);

    const { overlayRef, injector } = this.overlayService.createZoneAwareOverlay(
      config,
      this.injector
    );

    this.overlayRef = overlayRef;

    const portal = new TemplatePortal(this.panelTemplate(), this.vcr, undefined, injector);
    overlayRef.attach(portal);

    this.isOpen.set(true);

    overlayRef.backdropClick().pipe(takeUntil(overlayRef.detachments())).subscribe(() => this.close());
    overlayRef.keydownEvents().pipe(takeUntil(overlayRef.detachments())).subscribe((e: KeyboardEvent) => {
      if (e.key === 'Escape') this.close();
    });
  }

  private close(): void {
    if (!this.isOpen()) return;
    this.overlayRef?.dispose();
    this.overlayRef = null;
    this.isOpen.set(false);
  }

  /** Format a Date according to the dateFormat string */
  private formatDate(date: Date, format: string): string {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    let result = format;
    result = result.replace('dd', String(day).padStart(2, '0'));
    result = result.replace('mm', String(month).padStart(2, '0'));
    result = result.replace('yy', String(year));

    return result;
  }

  /** Parse a date string according to the dateFormat */
  private parseDate(value: string, format: string): Date | null {
    if (!value) return null;

    // Extract positions of dd, mm, yy in the format string
    const ddIdx = format.indexOf('dd');
    const mmIdx = format.indexOf('mm');
    const yyIdx = format.indexOf('yy');

    if (ddIdx === -1 || mmIdx === -1 || yyIdx === -1) return null;

    // Find the separator character (first char that's not d, m, y)
    const separatorMatch = format.match(/[^dmy]/);
    if (!separatorMatch) return null;
    const separator = separatorMatch[0];

    const parts = value.split(separator);
    if (parts.length < 3) return null;

    // Sort format parts by position to map value parts
    const formatParts = [
      { type: 'dd', pos: ddIdx },
      { type: 'mm', pos: mmIdx },
      { type: 'yy', pos: yyIdx },
    ].sort((a, b) => a.pos - b.pos);

    const values: Record<string, number> = {};
    formatParts.forEach((fp, i) => {
      values[fp.type] = parseInt(parts[i], 10);
    });

    if (isNaN(values['dd']) || isNaN(values['mm']) || isNaN(values['yy'])) return null;

    const result = new Date(values['yy'], values['mm'] - 1, values['dd']);
    if (isNaN(result.getTime())) return null;

    return result;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }
}
