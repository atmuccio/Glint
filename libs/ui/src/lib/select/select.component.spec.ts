import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintSelectComponent } from './select.component';
import { GlintSelectOptionComponent } from './select-option.component';

@Component({
  selector: 'glint-test-select-host',
  standalone: true,
  imports: [GlintSelectComponent, GlintSelectOptionComponent, ReactiveFormsModule],
  template: `
    <glint-select
      [placeholder]="placeholder"
      [multiple]="multiple"
      [searchable]="searchable"
      [disabled]="disabled"
      [formControl]="ctrl"
    >
      <glint-select-option [value]="'apple'">Apple</glint-select-option>
      <glint-select-option [value]="'banana'">Banana</glint-select-option>
      <glint-select-option [value]="'cherry'">Cherry</glint-select-option>
      <glint-select-option [value]="'disabled'" [disabled]="true">Disabled</glint-select-option>
    </glint-select>
  `,
})
class TestSelectHostComponent {
  ctrl = new FormControl<string | string[] | null>(null);
  placeholder = 'Choose...';
  multiple = false;
  searchable = false;
  disabled = false;
}

describe('GlintSelectComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestSelectHostComponent, OverlayModule],
    });
  });

  /** Create fixture — set props BEFORE first detectChanges to avoid NG0100 */
  function createFixture(overrides?: Partial<TestSelectHostComponent>) {
    const fixture = TestBed.createComponent(TestSelectHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getSelect(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('glint-select') as HTMLElement;
  }

  function getTrigger(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('.trigger') as HTMLElement;
  }

  async function openPanel(fixture: ReturnType<typeof createFixture>) {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getPanel() {
    return document.querySelector('.select-panel') as HTMLElement;
  }

  function getOptions() {
    return Array.from(document.querySelectorAll('glint-select-option')) as HTMLElement[];
  }

  // ── Basic rendering ─────────────────────────────

  it('should render trigger with placeholder', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('Choose...');
  });

  it('should have combobox role on trigger', () => {
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
    expect(getSelect(fixture).classList.contains('open')).toBe(true);
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('true');
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

  it('should show options with role="option"', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const options = getOptions();
    expect(options.length).toBe(4);
    expect(options[0].getAttribute('role')).toBe('option');
    expect(options[0].textContent?.trim()).toBe('Apple');
  });

  // ── Single select ──────────────────────────────

  it('should select an option on click (single)', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const options = getOptions();
    options[1].click(); // Banana
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('banana');
    // Panel closes after single select
    expect(getPanel()).toBeFalsy();
  });

  it('should display selected value text in trigger', async () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.setValue('apple');
    fixture.detectChanges();
    await fixture.whenStable();

    await openPanel(fixture);
    fixture.detectChanges();

    const trigger = getTrigger(fixture);
    expect(trigger.textContent).toContain('Apple');
  });

  it('should set aria-selected on selected option', async () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.setValue('banana');
    fixture.detectChanges();
    await openPanel(fixture);

    const options = getOptions();
    expect(options[1].getAttribute('aria-selected')).toBe('true');
    expect(options[0].getAttribute('aria-selected')).toBe('false');
  });

  // ── Multi select ───────────────────────────────

  it('should support multi-select mode', async () => {
    const fixture = createFixture({ multiple: true });
    fixture.componentInstance.ctrl.setValue([]);
    fixture.detectChanges();
    await openPanel(fixture);

    const panel = getPanel();
    expect(panel.getAttribute('aria-multiselectable')).toBe('true');

    const options = getOptions();
    options[0].click(); // Apple
    fixture.detectChanges();

    // Panel stays open in multi-select
    expect(getPanel()).toBeTruthy();

    options[2].click(); // Cherry
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toEqual(['apple', 'cherry']);
  });

  it('should toggle selection in multi-select', async () => {
    const fixture = createFixture({ multiple: true });
    fixture.componentInstance.ctrl.setValue(['apple']);
    fixture.detectChanges();
    await openPanel(fixture);

    const options = getOptions();
    options[0].click(); // deselect Apple
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toEqual([]);
  });

  it('should show checkboxes in multi-select mode', async () => {
    const fixture = createFixture({ multiple: true });
    await openPanel(fixture);

    const checkbox = document.querySelector('.checkbox');
    expect(checkbox).toBeTruthy();
  });

  // ── Disabled ───────────────────────────────────

  it('should not open when disabled', async () => {
    const fixture = createFixture({ disabled: true });

    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  it('should not select disabled option', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const options = getOptions();
    options[3].click(); // Disabled option
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBeNull();
  });

  // ── Keyboard ───────────────────────────────────

  it('should open panel on Enter key', async () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeTruthy();
  });

  it('should navigate options with arrow keys', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const panel = getPanel();

    // Arrow down to second option
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    const options = getOptions();
    expect(options[1].classList.contains('active')).toBe(true);

    // Arrow up back to first
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();

    expect(options[0].classList.contains('active')).toBe(true);
  });

  it('should select option with Enter key', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const panel = getPanel();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('apple');
  });

  it('should close panel on Escape key', async () => {
    const fixture = createFixture();
    await openPanel(fixture);
    expect(getPanel()).toBeTruthy();

    const panel = getPanel();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
    expect(getTrigger(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  // ── Search ─────────────────────────────────────

  it('should filter options when searchable', async () => {
    const fixture = createFixture({ searchable: true });
    await openPanel(fixture);

    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    expect(searchInput).toBeTruthy();

    searchInput.value = 'ban';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const visibleOptions = getOptions().filter(o => o.style.display !== 'none');
    expect(visibleOptions.length).toBe(1);
    expect(visibleOptions[0].textContent?.trim()).toBe('Banana');
  });

  it('should show empty message when no options match search', async () => {
    const fixture = createFixture({ searchable: true });
    await openPanel(fixture);

    const searchInput = document.querySelector('.search-input') as HTMLInputElement;
    searchInput.value = 'xyz';
    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    const emptyMsg = document.querySelector('.empty-message');
    expect(emptyMsg).toBeTruthy();
    expect(emptyMsg?.textContent?.trim()).toBe('No options found');
  });

  it('should have listbox role on panel', async () => {
    const fixture = createFixture();
    await openPanel(fixture);
    const panel = getPanel();
    expect(panel.getAttribute('role')).toBe('listbox');
  });

  // ── CVA ────────────────────────────────────────

  it('should write value from FormControl', async () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.setValue('cherry');
    fixture.detectChanges();
    await openPanel(fixture);

    const options = getOptions();
    expect(options[2].getAttribute('aria-selected')).toBe('true');
  });

  it('should set disabled state from FormControl', () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    expect(getSelect(fixture).classList.contains('disabled')).toBe(true);
  });
});
