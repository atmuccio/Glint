import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintMultiSelectComponent } from './multiselect.component';

const FLAT_OPTIONS = [
  { label: 'Apple', value: 'apple' },
  { label: 'Banana', value: 'banana' },
  { label: 'Cherry', value: 'cherry' },
  { label: 'Date', value: 'date' },
];

const GROUPED_OPTIONS = [
  {
    label: 'Fruits',
    items: [
      { label: 'Apple', value: 'apple' },
      { label: 'Banana', value: 'banana' },
    ],
  },
  {
    label: 'Vegetables',
    items: [
      { label: 'Carrot', value: 'carrot' },
      { label: 'Broccoli', value: 'broccoli' },
    ],
  },
];

@Component({
  selector: 'glint-test-multiselect-host',
  standalone: true,
  imports: [GlintMultiSelectComponent, ReactiveFormsModule],
  template: `
    <glint-multiselect
      [options]="options"
      [optionLabel]="optionLabel"
      [optionValue]="optionValue"
      [placeholder]="placeholder"
      [filter]="filter"
      [showToggleAll]="showToggleAll"
      [display]="display"
      [maxSelectedLabels]="maxSelectedLabels"
      [disabled]="disabled"
      [group]="group"
      [formControl]="ctrl"
    />
  `,
})
class TestMultiSelectHostComponent {
  ctrl = new FormControl<unknown[]>([]);
  options: Record<string, unknown>[] = FLAT_OPTIONS;
  optionLabel = 'label';
  optionValue = 'value';
  placeholder = 'Select...';
  filter = true;
  showToggleAll = true;
  display: 'comma' | 'chip' = 'comma';
  maxSelectedLabels = 3;
  disabled = false;
  group = false;
}

describe('GlintMultiSelectComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestMultiSelectHostComponent, OverlayModule],
    });
  });

  function createFixture(overrides?: Partial<TestMultiSelectHostComponent>) {
    const fixture = TestBed.createComponent(TestMultiSelectHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getTrigger(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('.multiselect-trigger') as HTMLElement;
  }

  function getHost(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('glint-multiselect') as HTMLElement;
  }

  async function openPanel(fixture: ReturnType<typeof createFixture>) {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getPanel() {
    return document.querySelector('glint-multiselect-panel') as HTMLElement;
  }

  function getOptions() {
    return Array.from(document.querySelectorAll('.option')) as HTMLElement[];
  }

  function getToggleAll() {
    return document.querySelector('.toggle-all-checkbox input') as HTMLInputElement;
  }

  function getFilterInput() {
    return document.querySelector('.filter-input') as HTMLInputElement;
  }

  // ── Basic rendering ─────────────────────────────

  it('should render trigger with placeholder', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('Select...');
  });

  it('should have combobox role', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
    expect(trigger.getAttribute('aria-haspopup')).toBe('listbox');
  });

  // ── Open / Close ────────────────────────────────

  it('should open panel on click', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    expect(getPanel()).toBeTruthy();
    expect(getHost(fixture).classList.contains('open')).toBe(true);
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('true');
  });

  it('should display options in panel', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const options = getOptions();
    expect(options.length).toBe(4);
    expect(options[0].textContent).toContain('Apple');
    expect(options[1].textContent).toContain('Banana');
    expect(options[2].textContent).toContain('Cherry');
    expect(options[3].textContent).toContain('Date');
  });

  it('should close panel on backdrop click', async () => {
    const fixture = createFixture();
    await openPanel(fixture);
    expect(getPanel()).toBeTruthy();

    const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  it('should not open when disabled', async () => {
    const fixture = createFixture({ disabled: true });

    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  // ── Selection ──────────────────────────────────

  it('should select option on click (toggle)', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const options = getOptions();
    options[0].click(); // Select Apple
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toEqual(['apple']);

    // Panel stays open (multi-select)
    expect(getPanel()).toBeTruthy();

    // Select another
    options[2].click(); // Select Cherry
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toEqual(['apple', 'cherry']);

    // Deselect Apple
    options[0].click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toEqual(['cherry']);
  });

  it('should show selected count in trigger', async () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.setValue(['apple', 'banana']);
    fixture.detectChanges();
    await fixture.whenStable();

    const trigger = getTrigger(fixture);
    expect(trigger.textContent).toContain('Apple');
    expect(trigger.textContent).toContain('Banana');
  });

  it('should show "N items selected" when exceeding maxSelectedLabels', async () => {
    const fixture = createFixture({ maxSelectedLabels: 2 });
    fixture.componentInstance.ctrl.setValue(['apple', 'banana', 'cherry']);
    fixture.detectChanges();
    await fixture.whenStable();

    const trigger = getTrigger(fixture);
    expect(trigger.textContent).toContain('3 items selected');
  });

  // ── Chip display ──────────────────────────────

  it('should show chips when display is chip', async () => {
    const fixture = createFixture({ display: 'chip' });
    fixture.componentInstance.ctrl.setValue(['apple', 'banana']);
    fixture.detectChanges();
    await fixture.whenStable();

    const chips = fixture.nativeElement.querySelectorAll('.chip');
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toContain('Apple');
    expect(chips[1].textContent).toContain('Banana');
  });

  it('should remove chip on chip remove button click', async () => {
    const fixture = createFixture({ display: 'chip' });
    fixture.componentInstance.ctrl.setValue(['apple', 'banana']);
    fixture.detectChanges();
    await fixture.whenStable();

    const removeBtn = fixture.nativeElement.querySelector('.chip-remove') as HTMLElement;
    removeBtn.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toEqual(['banana']);
    const chips = fixture.nativeElement.querySelectorAll('.chip');
    expect(chips.length).toBe(1);
  });

  // ── CVA ────────────────────────────────────────

  it('should work with FormControl (CVA)', async () => {
    const fixture = createFixture();
    // Write value
    fixture.componentInstance.ctrl.setValue(['cherry']);
    fixture.detectChanges();
    await fixture.whenStable();

    await openPanel(fixture);

    const options = getOptions();
    expect(options[2].classList.contains('selected')).toBe(true);
    expect(options[2].getAttribute('aria-selected')).toBe('true');
  });

  it('should set disabled state from FormControl', () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    expect(getHost(fixture).classList.contains('disabled')).toBe(true);
  });

  // ── Filter ────────────────────────────────────

  it('should filter options', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const filterInput = getFilterInput();
    expect(filterInput).toBeTruthy();

    filterInput.value = 'ban';
    filterInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const options = getOptions();
    expect(options.length).toBe(1);
    expect(options[0].textContent).toContain('Banana');
  });

  // ── Toggle All ────────────────────────────────

  it('should toggle all with select all checkbox', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const toggleAll = getToggleAll();
    expect(toggleAll).toBeTruthy();

    // Select all
    toggleAll.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toEqual(['apple', 'banana', 'cherry', 'date']);

    // Deselect all
    toggleAll.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toEqual([]);
  });

  // ── Keyboard ───────────────────────────────────

  it('should open panel on ArrowDown key', async () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeTruthy();
    expect(getHost(fixture).classList.contains('open')).toBe(true);
  });

  it('should close panel on Escape key', async () => {
    const fixture = createFixture();
    await openPanel(fixture);
    expect(getPanel()).toBeTruthy();

    const trigger = getTrigger(fixture);
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  it('should open panel on Enter key', async () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeTruthy();
  });

  it('should open panel on Space key', async () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeTruthy();
  });

  // ── Grouped ────────────────────────────────────

  it('should display grouped options', async () => {
    const fixture = createFixture({ group: true, options: GROUPED_OPTIONS });
    await openPanel(fixture);

    const groupLabels = Array.from(document.querySelectorAll('.option-group-label')) as HTMLElement[];
    expect(groupLabels.length).toBe(2);
    expect(groupLabels[0].textContent).toContain('Fruits');
    expect(groupLabels[1].textContent).toContain('Vegetables');

    const options = getOptions();
    expect(options.length).toBe(4);
  });
});
