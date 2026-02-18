import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';

/** Day cell entry for the calendar grid */
export interface CalendarDay {
  date: Date;
  otherMonth: boolean;
}

/**
 * Internal calendar panel for the DatePicker.
 * Renders date/month/year views with navigation.
 */
@Component({
  selector: 'glint-datepicker-panel',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'glint-datepicker-panel',
  },
  styles: `
    :host {
      display: block;
      font-family: var(--glint-font-family);
      font-size: var(--glint-font-size);
    }

    .calendar {
      min-inline-size: 280px;
      background: var(--glint-color-surface);
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
      padding: var(--glint-spacing-md);
    }

    .calendar-months {
      display: flex;
      gap: var(--glint-spacing-md);
    }

    .calendar-month {
      flex: 1;
    }

    .calendar-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-block-end: var(--glint-spacing-sm);
    }

    .calendar-header button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      cursor: pointer;
      padding: var(--glint-spacing-xs);
      border-radius: var(--glint-border-radius);
      font: inherit;
      min-inline-size: 2rem;
      min-block-size: 2rem;
      transition: background-color var(--glint-duration-fast) var(--glint-easing-standard, ease);
    }

    .calendar-header button:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    .calendar-header button:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .month-year-label {
      font-weight: 600;
      font-size: 0.9375em;
    }

    .calendar-weekdays {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      margin-block-end: var(--glint-spacing-xs);
    }

    .weekday {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--glint-color-text-muted);
      font-size: 0.8125em;
      font-weight: 500;
      block-size: 2.25rem;
      user-select: none;
    }

    .calendar-days {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
    }

    .day {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: 2px solid transparent;
      background: transparent;
      color: var(--glint-color-text);
      cursor: pointer;
      padding: 0;
      inline-size: 2.25rem;
      block-size: 2.25rem;
      border-radius: 50%;
      font: inherit;
      font-size: 0.875em;
      transition:
        background-color var(--glint-duration-fast) var(--glint-easing-standard, ease),
        color var(--glint-duration-fast) var(--glint-easing-standard, ease),
        border-color var(--glint-duration-fast) var(--glint-easing-standard, ease);
    }

    .day:hover:not(.disabled):not(.selected) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    .day:focus-visible {
      outline: 2px solid var(--glint-color-focus-ring);
      outline-offset: -2px;
    }

    .day.today:not(.selected) {
      border-color: var(--glint-color-primary);
      font-weight: 700;
    }

    .day.selected {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast, #fff);
    }

    .day.other-month {
      color: var(--glint-color-text-muted);
      opacity: 0.5;
    }

    .day.disabled {
      opacity: 0.3;
      cursor: not-allowed;
      pointer-events: none;
    }

    .day.in-range:not(.selected) {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 80%);
      border-radius: 0;
    }

    /* ── Time picker ────────────────────────── */
    .time-picker {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: var(--glint-spacing-xs);
      padding-block-start: var(--glint-spacing-sm);
      margin-block-start: var(--glint-spacing-sm);
      border-block-start: 1px solid var(--glint-color-border);
    }

    .time-picker input {
      inline-size: 3rem;
      text-align: center;
      border: 1px solid var(--glint-color-border);
      border-radius: var(--glint-border-radius);
      background: var(--glint-color-surface);
      color: var(--glint-color-text);
      padding: var(--glint-spacing-xs);
      font: inherit;
      -moz-appearance: textfield;
    }

    .time-picker input::-webkit-inner-spin-button,
    .time-picker input::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    .time-separator {
      font-weight: 600;
    }

    /* ── Button bar ─────────────────────────── */
    .button-bar {
      display: flex;
      justify-content: space-between;
      padding-block-start: var(--glint-spacing-sm);
      margin-block-start: var(--glint-spacing-sm);
      border-block-start: 1px solid var(--glint-color-border);
    }

    .button-bar button {
      border: none;
      background: transparent;
      color: var(--glint-color-primary);
      cursor: pointer;
      padding: var(--glint-spacing-xs) var(--glint-spacing-sm);
      border-radius: var(--glint-border-radius);
      font: inherit;
      font-size: 0.875em;
      font-weight: 500;
      transition: background-color var(--glint-duration-fast) var(--glint-easing-standard, ease);
    }

    .button-bar button:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 90%);
    }

    /* ── Month / Year grid views ────────────── */
    .month-grid,
    .year-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: var(--glint-spacing-xs);
    }

    .month-cell,
    .year-cell {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      background: transparent;
      color: var(--glint-color-text);
      cursor: pointer;
      padding: var(--glint-spacing-sm) var(--glint-spacing-xs);
      border-radius: var(--glint-border-radius);
      font: inherit;
      font-size: 0.875em;
      transition: background-color var(--glint-duration-fast) var(--glint-easing-standard, ease);
    }

    .month-cell:hover,
    .year-cell:hover {
      background: color-mix(in oklch, var(--glint-color-primary), transparent 85%);
    }

    .month-cell.selected,
    .year-cell.selected {
      background: var(--glint-color-primary);
      color: var(--glint-color-primary-contrast, #fff);
    }
  `,
  template: `
    <div class="calendar">
      @switch (viewMode()) {
        @case ('date') {
          <div class="calendar-months">
            @for (monthOffset of monthOffsets(); track monthOffset) {
              <div class="calendar-month">
                <div class="calendar-header">
                  @if (monthOffset === 0) {
                    <button (click)="prevMonth()" type="button" aria-label="Previous month">&lsaquo;</button>
                  } @else {
                    <span></span>
                  }
                  <button class="month-year-label" (click)="viewMode.set('month')" type="button">
                    {{ getMonthName(currentMonth() + monthOffset, currentYear()) }} {{ getYearForOffset(monthOffset) }}
                  </button>
                  @if (monthOffset === numberOfMonths() - 1) {
                    <button (click)="nextMonth()" type="button" aria-label="Next month">&rsaquo;</button>
                  } @else {
                    <span></span>
                  }
                </div>
                <div class="calendar-weekdays">
                  @for (day of weekDayNames(); track day) {
                    <span class="weekday">{{ day }}</span>
                  }
                </div>
                <div class="calendar-days">
                  @for (day of getCalendarDaysForMonth(monthOffset); track day.date.getTime()) {
                    <button
                      class="day"
                      [class.today]="isToday(day.date)"
                      [class.selected]="isSelected(day.date)"
                      [class.other-month]="day.otherMonth"
                      [class.disabled]="isDateDisabled(day.date)"
                      [class.in-range]="isInRange(day.date)"
                      [attr.aria-selected]="isSelected(day.date)"
                      [attr.aria-disabled]="isDateDisabled(day.date) || null"
                      (click)="onDayClick(day.date)"
                      type="button"
                    >{{ day.date.getDate() }}</button>
                  }
                </div>
              </div>
            }
          </div>
          @if (showTime()) {
            <div class="time-picker">
              <input
                type="number"
                [value]="selectedHour()"
                (input)="setHour($event)"
                min="0"
                [max]="hourFormat() === '12' ? 12 : 23"
                aria-label="Hour"
              />
              <span class="time-separator">:</span>
              <input
                type="number"
                [value]="selectedMinute()"
                (input)="setMinute($event)"
                min="0"
                max="59"
                aria-label="Minute"
              />
            </div>
          }
          @if (showButtonBar()) {
            <div class="button-bar">
              <button (click)="selectToday()" type="button">Today</button>
              <button (click)="onClear()" type="button">Clear</button>
            </div>
          }
        }
        @case ('month') {
          <div class="calendar-header">
            <button (click)="prevYear()" type="button" aria-label="Previous year">&lsaquo;</button>
            <button class="month-year-label" (click)="viewMode.set('year')" type="button">{{ currentYear() }}</button>
            <button (click)="nextYear()" type="button" aria-label="Next year">&rsaquo;</button>
          </div>
          <div class="month-grid">
            @for (m of monthNames(); track m.index) {
              <button
                class="month-cell"
                [class.selected]="m.index === currentMonth()"
                (click)="selectMonth(m.index)"
                type="button"
              >{{ m.short }}</button>
            }
          </div>
        }
        @case ('year') {
          <div class="calendar-header">
            <button (click)="prevDecade()" type="button" aria-label="Previous decade">&lsaquo;</button>
            <span class="month-year-label">{{ decadeStart() }} - {{ decadeStart() + 11 }}</span>
            <button (click)="nextDecade()" type="button" aria-label="Next decade">&rsaquo;</button>
          </div>
          <div class="year-grid">
            @for (y of decadeYears(); track y) {
              <button
                class="year-cell"
                [class.selected]="y === currentYear()"
                (click)="selectYear(y)"
                type="button"
              >{{ y }}</button>
            }
          </div>
        }
      }
    </div>
  `,
})
export class GlintDatepickerPanelComponent {
  /** Currently selected value(s) */
  value = input<Date | Date[] | null>(null);
  /** Selection mode */
  selectionMode = input<'single' | 'range' | 'multiple'>('single');
  /** Show time picker */
  showTime = input(false);
  /** Hour format */
  hourFormat = input<'12' | '24'>('24');
  /** Show Today/Clear button bar */
  showButtonBar = input(false);
  /** Number of months to show side by side */
  numberOfMonths = input(1);
  /** First day of week (0=Sunday, 1=Monday, ...) */
  firstDayOfWeek = input(0);
  /** Minimum selectable date */
  minDate = input<Date | null>(null);
  /** Maximum selectable date */
  maxDate = input<Date | null>(null);

  /** Emitted when a date is selected */
  dateSelect = output<Date>();
  /** Emitted when the current month changes */
  monthChange = output<{ month: number; year: number }>();
  /** Emitted when the clear button is clicked */
  clearValue = output<void>();

  /** Current month in view (0-based) */
  currentMonth = signal(new Date().getMonth());
  /** Current year in view */
  currentYear = signal(new Date().getFullYear());
  /** Current view mode */
  viewMode = signal<'date' | 'month' | 'year'>('date');
  /** Decade start for year view */
  decadeStart = signal(Math.floor(new Date().getFullYear() / 10) * 10);

  /** Selected hour */
  selectedHour = computed(() => {
    const v = this.value();
    const d = Array.isArray(v) ? v[0] : v;
    return d ? d.getHours() : 0;
  });

  /** Selected minute */
  selectedMinute = computed(() => {
    const v = this.value();
    const d = Array.isArray(v) ? v[0] : v;
    return d ? d.getMinutes() : 0;
  });

  /** Week day name headers rotated by firstDayOfWeek */
  weekDayNames = computed(() => {
    const names = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
    const start = this.firstDayOfWeek();
    return [...names.slice(start), ...names.slice(0, start)];
  });

  /** All 12 month names */
  monthNames = computed(() => {
    const formatter = new Intl.DateTimeFormat(undefined, { month: 'short' });
    return Array.from({ length: 12 }, (_, i) => ({
      index: i,
      short: formatter.format(new Date(2020, i, 1)),
    }));
  });

  /** Offsets for multiple month display [0, 1, ...] */
  monthOffsets = computed(() =>
    Array.from({ length: this.numberOfMonths() }, (_, i) => i)
  );

  /** Years in current decade view (12 years) */
  decadeYears = computed(() => {
    const start = this.decadeStart();
    return Array.from({ length: 12 }, (_, i) => start + i);
  });

  /** Get calendar days for the given month offset */
  getCalendarDaysForMonth(monthOffset: number): CalendarDay[] {
    let month = this.currentMonth() + monthOffset;
    let year = this.currentYear();

    // Handle month overflow
    while (month > 11) {
      month -= 12;
      year++;
    }
    while (month < 0) {
      month += 12;
      year--;
    }

    return this.generateCalendarDays(month, year);
  }

  /** Get month name for potentially offset month */
  getMonthName(rawMonth: number, year: number): string {
    let month = rawMonth;
    let adjustedYear = year;
    while (month > 11) {
      month -= 12;
      adjustedYear++;
    }
    while (month < 0) {
      month += 12;
      adjustedYear--;
    }
    const formatter = new Intl.DateTimeFormat(undefined, { month: 'long' });
    return formatter.format(new Date(adjustedYear, month, 1));
  }

  /** Get year for month offset (handles overflow) */
  getYearForOffset(monthOffset: number): number {
    let month = this.currentMonth() + monthOffset;
    let year = this.currentYear();
    while (month > 11) {
      month -= 12;
      year++;
    }
    return year;
  }

  /** Navigate to previous month */
  prevMonth(): void {
    let month = this.currentMonth() - 1;
    let year = this.currentYear();
    if (month < 0) {
      month = 11;
      year--;
    }
    this.currentMonth.set(month);
    this.currentYear.set(year);
    this.monthChange.emit({ month: month + 1, year });
  }

  /** Navigate to next month */
  nextMonth(): void {
    let month = this.currentMonth() + 1;
    let year = this.currentYear();
    if (month > 11) {
      month = 0;
      year++;
    }
    this.currentMonth.set(month);
    this.currentYear.set(year);
    this.monthChange.emit({ month: month + 1, year });
  }

  /** Navigate to previous year */
  prevYear(): void {
    this.currentYear.update(y => y - 1);
  }

  /** Navigate to next year */
  nextYear(): void {
    this.currentYear.update(y => y + 1);
  }

  /** Navigate to previous decade */
  prevDecade(): void {
    this.decadeStart.update(d => d - 10);
  }

  /** Navigate to next decade */
  nextDecade(): void {
    this.decadeStart.update(d => d + 10);
  }

  /** Select a month from month view */
  selectMonth(month: number): void {
    this.currentMonth.set(month);
    this.viewMode.set('date');
  }

  /** Select a year from year view */
  selectYear(year: number): void {
    this.currentYear.set(year);
    this.decadeStart.set(Math.floor(year / 10) * 10);
    this.viewMode.set('month');
  }

  /** Handle day click */
  onDayClick(date: Date): void {
    if (this.isDateDisabled(date)) return;

    // If showTime, preserve the existing time on the selected date
    if (this.showTime()) {
      const hour = this.selectedHour();
      const minute = this.selectedMinute();
      date = new Date(date);
      date.setHours(hour, minute, 0, 0);
    }

    this.dateSelect.emit(date);
  }

  /** Select today */
  selectToday(): void {
    const now = new Date();
    this.currentMonth.set(now.getMonth());
    this.currentYear.set(now.getFullYear());
    this.dateSelect.emit(now);
  }

  /** Emit clear event */
  onClear(): void {
    this.clearValue.emit();
  }

  /** Set hour from time input */
  setHour(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(val)) return;
    const v = this.value();
    const base = (Array.isArray(v) ? v[0] : v) ?? new Date();
    const d = new Date(base);
    d.setHours(val);
    this.dateSelect.emit(d);
  }

  /** Set minute from time input */
  setMinute(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (isNaN(val)) return;
    const v = this.value();
    const base = (Array.isArray(v) ? v[0] : v) ?? new Date();
    const d = new Date(base);
    d.setMinutes(val);
    this.dateSelect.emit(d);
  }

  /** Check if a date is today */
  isToday(date: Date): boolean {
    const now = new Date();
    return (
      date.getDate() === now.getDate() &&
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  /** Check if a date is selected */
  isSelected(date: Date): boolean {
    const v = this.value();
    if (!v) return false;
    if (Array.isArray(v)) {
      return v.some(d => this.isSameDay(d, date));
    }
    return this.isSameDay(v, date);
  }

  /** Check if a date is in range (for range mode) */
  isInRange(date: Date): boolean {
    if (this.selectionMode() !== 'range') return false;
    const v = this.value();
    if (!Array.isArray(v) || v.length !== 2) return false;
    const [start, end] = v;
    if (!start || !end) return false;
    const time = date.getTime();
    return time > start.getTime() && time < end.getTime();
  }

  /** Check if a date is disabled */
  isDateDisabled(date: Date): boolean {
    const min = this.minDate();
    const max = this.maxDate();
    if (min && date < this.startOfDay(min)) return true;
    if (max && date > this.endOfDay(max)) return true;
    return false;
  }

  // ── Private helpers ──────────────────────────

  private generateCalendarDays(month: number, year: number): CalendarDay[] {
    const firstOfMonth = new Date(year, month, 1);
    const firstDow = firstOfMonth.getDay();
    const startOffset = (firstDow - this.firstDayOfWeek() + 7) % 7;

    const days: CalendarDay[] = [];

    // Back-fill days from previous month
    for (let i = startOffset - 1; i >= 0; i--) {
      const d = new Date(year, month, -i);
      days.push({ date: d, otherMonth: true });
    }

    // Current month days
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: new Date(year, month, i), otherMonth: false });
    }

    // Forward-fill to 42 cells (6 weeks)
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({ date: new Date(year, month + 1, i), otherMonth: true });
    }

    return days;
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getDate() === b.getDate() &&
      a.getMonth() === b.getMonth() &&
      a.getFullYear() === b.getFullYear()
    );
  }

  private startOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  private endOfDay(d: Date): Date {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
  }
}
