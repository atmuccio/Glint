import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintDatepickerComponent } from './datepicker.component';

@Component({
  selector: 'glint-test-datepicker-host',
  standalone: true,
  imports: [GlintDatepickerComponent, ReactiveFormsModule],
  template: `
    <glint-datepicker
      [placeholder]="placeholder"
      [disabled]="disabled"
      [showButtonBar]="showButtonBar"
      [showIcon]="showIcon"
      [selectionMode]="selectionMode"
      [minDate]="minDate"
      [maxDate]="maxDate"
      [inline]="inline"
      [formControl]="ctrl"
    />
  `,
})
class TestDatepickerHostComponent {
  ctrl = new FormControl<Date | Date[] | null>(null);
  placeholder = 'Select a date';
  disabled = false;
  showButtonBar = false;
  showIcon = true;
  selectionMode: 'single' | 'range' | 'multiple' = 'single';
  minDate: Date | null = null;
  maxDate: Date | null = null;
  inline = false;
}

describe('GlintDatepickerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestDatepickerHostComponent, OverlayModule],
    });
  });

  function createFixture(overrides?: Partial<TestDatepickerHostComponent>) {
    const fixture = TestBed.createComponent(TestDatepickerHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getInput(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('.datepicker-input') as HTMLInputElement;
  }

  function getDatepicker(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('glint-datepicker') as HTMLElement;
  }

  async function openCalendar(fixture: ReturnType<typeof createFixture>) {
    const input = getInput(fixture);
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getCalendar() {
    return document.querySelector('.calendar') as HTMLElement;
  }

  function getDayButtons() {
    return Array.from(document.querySelectorAll('.day')) as HTMLButtonElement[];
  }

  function getNavButtons() {
    return Array.from(
      document.querySelectorAll('.calendar-header button')
    ) as HTMLButtonElement[];
  }

  // ── Basic rendering ─────────────────────────────

  it('should render input with placeholder', () => {
    const fixture = createFixture();
    const input = getInput(fixture);
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Select a date');
  });

  it('should show calendar icon when showIcon is true', () => {
    const fixture = createFixture();
    const icon = fixture.nativeElement.querySelector('.datepicker-icon');
    expect(icon).toBeTruthy();
  });

  // ── Open / Close ────────────────────────────────

  it('should open calendar panel on click', async () => {
    const fixture = createFixture();
    await openCalendar(fixture);

    expect(getCalendar()).toBeTruthy();
    expect(getDatepicker(fixture).classList.contains('open')).toBe(true);
  });

  it('should close calendar on backdrop click', async () => {
    const fixture = createFixture();
    await openCalendar(fixture);
    expect(getCalendar()).toBeTruthy();

    const backdrop = document.querySelector(
      '.cdk-overlay-backdrop'
    ) as HTMLElement;
    backdrop?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getCalendar()).toBeFalsy();
  });

  // ── Calendar days ───────────────────────────────

  it('should render calendar days', async () => {
    const fixture = createFixture();
    await openCalendar(fixture);

    const days = getDayButtons();
    // 42 days = 6 weeks
    expect(days.length).toBe(42);
  });

  // ── Date selection ──────────────────────────────

  it('should select a date on day click', async () => {
    const fixture = createFixture();
    await openCalendar(fixture);

    // Find a day that is NOT other-month and NOT disabled
    const days = getDayButtons();
    const currentMonthDay = days.find(
      (d) => !d.classList.contains('other-month') && !d.classList.contains('disabled')
    );
    expect(currentMonthDay).toBeTruthy();

    currentMonthDay?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const value = fixture.componentInstance.ctrl.value;
    expect(value).toBeInstanceOf(Date);
    // Panel should close after single select
    expect(getCalendar()).toBeFalsy();
  });

  // ── Navigation ──────────────────────────────────

  it('should navigate to previous month', async () => {
    const fixture = createFixture();
    await openCalendar(fixture);

    const navButtons = getNavButtons();
    // First button is "Previous month"
    const prevBtn = navButtons.find(
      (b) => b.getAttribute('aria-label') === 'Previous month'
    );
    expect(prevBtn).toBeTruthy();

    // Get current month name from the month-year label
    const monthLabel = document.querySelector(
      '.month-year-label'
    ) as HTMLElement;
    const initialText = monthLabel.textContent;

    prevBtn?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const updatedText = (
      document.querySelector('.month-year-label') as HTMLElement
    ).textContent;
    expect(updatedText).not.toBe(initialText);
  });

  it('should navigate to next month', async () => {
    const fixture = createFixture();
    await openCalendar(fixture);

    const navButtons = getNavButtons();
    const nextBtn = navButtons.find(
      (b) => b.getAttribute('aria-label') === 'Next month'
    );
    expect(nextBtn).toBeTruthy();

    const monthLabel = document.querySelector(
      '.month-year-label'
    ) as HTMLElement;
    const initialText = monthLabel.textContent;

    nextBtn?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    const updatedText = (
      document.querySelector('.month-year-label') as HTMLElement
    ).textContent;
    expect(updatedText).not.toBe(initialText);
  });

  // ── Today highlight ─────────────────────────────

  it('should have today highlighted', async () => {
    const fixture = createFixture();
    await openCalendar(fixture);

    const todayBtn = document.querySelector('.day.today') as HTMLElement;
    expect(todayBtn).toBeTruthy();
    expect(todayBtn.textContent?.trim()).toBe(String(new Date().getDate()));
  });

  // ── CVA ─────────────────────────────────────────

  it('should work with FormControl (CVA)', async () => {
    const testDate = new Date(2024, 5, 15); // June 15, 2024
    const fixture = createFixture();

    fixture.componentInstance.ctrl.setValue(testDate);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = getInput(fixture);
    expect(input.value).toBeTruthy();
    expect(input.value).toContain('06');
    expect(input.value).toContain('15');
    expect(input.value).toContain('2024');
  });

  // ── Formatted value ─────────────────────────────

  it('should format date in input', async () => {
    const fixture = createFixture();
    const testDate = new Date(2024, 0, 7); // Jan 7, 2024
    fixture.componentInstance.ctrl.setValue(testDate);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = getInput(fixture);
    // Default format is mm/dd/yy
    expect(input.value).toBe('01/07/2024');
  });

  // ── Disabled ────────────────────────────────────

  it('should not open when disabled', async () => {
    const fixture = createFixture({ disabled: true });

    const input = getInput(fixture);
    input.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getCalendar()).toBeFalsy();
    expect(getDatepicker(fixture).classList.contains('disabled')).toBe(true);
  });

  // ── Min/Max dates ───────────────────────────────

  it('should disable dates outside min/max range', async () => {
    const now = new Date();
    const minDate = new Date(now.getFullYear(), now.getMonth(), 10);
    const maxDate = new Date(now.getFullYear(), now.getMonth(), 20);

    const fixture = createFixture({ minDate, maxDate });
    await openCalendar(fixture);

    const days = getDayButtons();
    const currentMonthDays = days.filter(
      (d) => !d.classList.contains('other-month')
    );

    // Days before min should be disabled
    const earlyDays = currentMonthDays.filter(
      (d) => parseInt(d.textContent?.trim() ?? '0', 10) < 10
    );
    for (const d of earlyDays) {
      expect(d.classList.contains('disabled')).toBe(true);
    }

    // Days within range should NOT be disabled
    const midDays = currentMonthDays.filter((d) => {
      const num = parseInt(d.textContent?.trim() ?? '0', 10);
      return num >= 10 && num <= 20;
    });
    for (const d of midDays) {
      expect(d.classList.contains('disabled')).toBe(false);
    }
  });

  // ── Button bar ──────────────────────────────────

  it('should show button bar when showButtonBar is true', async () => {
    const fixture = createFixture({ showButtonBar: true });
    await openCalendar(fixture);

    const buttonBar = document.querySelector('.button-bar') as HTMLElement;
    expect(buttonBar).toBeTruthy();

    const buttons = buttonBar.querySelectorAll('button');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent?.trim()).toBe('Today');
    expect(buttons[1].textContent?.trim()).toBe('Clear');
  });
});
