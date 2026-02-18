import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { vi } from 'vitest';
import { GlintAutoCompleteComponent } from './autocomplete.component';

@Component({
  selector: 'glint-test-autocomplete-host',
  standalone: true,
  imports: [GlintAutoCompleteComponent, ReactiveFormsModule],
  template: `
    <glint-autocomplete
      [suggestions]="suggestions"
      [field]="field"
      [multiple]="multiple"
      [dropdown]="dropdown"
      [forceSelection]="forceSelection"
      [minLength]="minLength"
      [delay]="delay"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [completeOnFocus]="completeOnFocus"
      [formControl]="ctrl"
      (completeMethod)="onComplete($event)"
      (itemSelect)="onItemSelect($event)"
      (itemUnselect)="onItemUnselect($event)"
    />
  `,
})
class TestAutoCompleteHostComponent {
  ctrl = new FormControl<unknown>(null);
  suggestions: unknown[] = [];
  field = 'label';
  multiple = false;
  dropdown = false;
  forceSelection = false;
  minLength = 1;
  delay = 300;
  placeholder = 'Search...';
  disabled = false;
  completeOnFocus = false;

  lastCompleteQuery = '';
  selectedItem: unknown = null;
  unselectedItem: unknown = null;

  onComplete(event: { query: string }): void {
    this.lastCompleteQuery = event.query;
  }

  onItemSelect(item: unknown): void {
    this.selectedItem = item;
  }

  onItemUnselect(item: unknown): void {
    this.unselectedItem = item;
  }
}

describe('GlintAutoCompleteComponent', () => {
  let fixture: ComponentFixture<TestAutoCompleteHostComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestAutoCompleteHostComponent, OverlayModule],
    });
  });

  afterEach(() => {
    // Close any open panels before cleanup
    try {
      const ac = getAutoComplete();
      ac.closePanel();
    } catch {
      // ignore if fixture not created
    }
    fixture?.destroy();
  });

  /** Create fixture — set props BEFORE first detectChanges to avoid NG0100 */
  function createFixture(overrides?: Partial<TestAutoCompleteHostComponent>) {
    fixture = TestBed.createComponent(TestAutoCompleteHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  /**
   * Create fixture with auto-detect enabled and suggestions pre-set.
   * `autoDetectChanges()` integrates with NgZone so that CDK overlay
   * creation doesn't cause NG0100 from stale root CD values.
   */
  function createAutoFixture(overrides?: Partial<TestAutoCompleteHostComponent>) {
    fixture = TestBed.createComponent(TestAutoCompleteHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.autoDetectChanges();
    return fixture;
  }

  function getInput(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.autocomplete-input') as HTMLInputElement;
  }

  function typeInInput(value: string): void {
    const input = getInput();
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
  }

  function getAutoComplete(): GlintAutoCompleteComponent {
    return fixture.debugElement.children[0].componentInstance;
  }

  function getPanelItems(): HTMLElement[] {
    return Array.from(
      document.querySelectorAll('.suggestion-item')
    ) as HTMLElement[];
  }

  function getPanel(): HTMLElement | null {
    return document.querySelector('glint-autocomplete-panel');
  }

  // ── Basic rendering ──────────────────────────────

  it('should render input with placeholder', () => {
    createFixture({ placeholder: 'Type here...' });
    const input = getInput();
    expect(input).toBeTruthy();
    expect(input.getAttribute('placeholder')).toBe('Type here...');
  });

  it('should have combobox role', () => {
    createFixture();
    const input = getInput();
    expect(input.getAttribute('role')).toBe('combobox');
    expect(input.getAttribute('aria-expanded')).toBe('false');
    expect(input.getAttribute('aria-autocomplete')).toBe('list');
    expect(input.getAttribute('autocomplete')).toBe('off');
  });

  // ── completeMethod ───────────────────────────────

  it('should emit completeMethod on input', () => {
    vi.useFakeTimers();
    createFixture({ delay: 300 });
    typeInInput('abc');
    vi.advanceTimersByTime(300);
    fixture.detectChanges();
    expect(fixture.componentInstance.lastCompleteQuery).toBe('abc');
    vi.useRealTimers();
  });

  // ── Suggestions panel ────────────────────────────

  it('should display suggestions panel', async () => {
    createAutoFixture({ suggestions: ['Apple', 'Banana', 'Cherry'] });
    await fixture.whenStable();

    const ac = getAutoComplete();
    ac.openPanel();
    await fixture.whenStable();

    const items = getPanelItems();
    expect(items.length).toBe(3);
    expect(items[0].textContent?.trim()).toBe('Apple');
    expect(items[1].textContent?.trim()).toBe('Banana');
    expect(items[2].textContent?.trim()).toBe('Cherry');
  });

  it('should show panel items with role="option"', async () => {
    createAutoFixture({ suggestions: ['Apple', 'Banana'] });
    await fixture.whenStable();

    const ac = getAutoComplete();
    ac.openPanel();
    await fixture.whenStable();

    const items = getPanelItems();
    expect(items[0].getAttribute('role')).toBe('option');
    expect(items[1].getAttribute('role')).toBe('option');
  });

  // ── Selection ────────────────────────────────────

  it('should select suggestion on click', async () => {
    createAutoFixture({ suggestions: ['Apple', 'Banana', 'Cherry'] });
    await fixture.whenStable();

    const ac = getAutoComplete();
    ac.openPanel();
    await fixture.whenStable();

    const items = getPanelItems();
    items[1].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('Banana');
    expect(fixture.componentInstance.selectedItem).toBe('Banana');
    // Panel should close after single selection
    expect(getPanel()).toBeFalsy();
  });

  it('should select object suggestion and display field value', async () => {
    const suggestions = [
      { name: 'United States', code: 'US' },
      { name: 'Canada', code: 'CA' },
    ];
    createAutoFixture({ field: 'name', suggestions });
    await fixture.whenStable();

    const ac = getAutoComplete();
    ac.openPanel();
    await fixture.whenStable();

    const items = getPanelItems();
    expect(items[0].textContent?.trim()).toBe('United States');

    items[0].click();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toEqual({ name: 'United States', code: 'US' });
    const input = getInput();
    expect(input.value).toBe('United States');
  });

  // ── CVA ──────────────────────────────────────────

  it('should work with FormControl (CVA)', () => {
    createFixture();
    // Set value programmatically
    fixture.componentInstance.ctrl.setValue('Preset');
    fixture.detectChanges();

    const input = getInput();
    expect(input.value).toBe('Preset');
  });

  it('should set disabled state from FormControl', () => {
    createFixture();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-autocomplete') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
    expect(getInput().disabled).toBe(true);
  });

  // ── Multiple mode ────────────────────────────────

  it('should render chips in multiple mode', () => {
    createFixture({ multiple: true });
    fixture.componentInstance.ctrl.setValue(['Apple', 'Banana']);
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll('.chip') as NodeListOf<HTMLElement>;
    expect(chips.length).toBe(2);
    expect(chips[0].textContent).toContain('Apple');
    expect(chips[1].textContent).toContain('Banana');
  });

  it('should remove chip on remove button click', () => {
    createFixture({ multiple: true });
    fixture.componentInstance.ctrl.setValue(['Apple', 'Banana']);
    fixture.detectChanges();

    const removeButtons = fixture.nativeElement.querySelectorAll('.chip-remove') as NodeListOf<HTMLButtonElement>;
    expect(removeButtons.length).toBe(2);

    removeButtons[0].click();
    fixture.detectChanges();

    const chips = fixture.nativeElement.querySelectorAll('.chip') as NodeListOf<HTMLElement>;
    expect(chips.length).toBe(1);
    expect(chips[0].textContent).toContain('Banana');
    expect(fixture.componentInstance.ctrl.value).toEqual(['Banana']);
    expect(fixture.componentInstance.unselectedItem).toBe('Apple');
  });

  // ── Disabled ─────────────────────────────────────

  it('should not open when disabled', async () => {
    createAutoFixture({ disabled: true, suggestions: ['Apple', 'Banana'] });
    await fixture.whenStable();

    const ac = getAutoComplete();
    ac.openPanel();
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });

  // ── Keyboard ─────────────────────────────────────

  it('should close panel on Escape', async () => {
    createAutoFixture({ suggestions: ['Apple', 'Banana'] });
    await fixture.whenStable();

    const ac = getAutoComplete();
    ac.openPanel();
    await fixture.whenStable();
    expect(getPanel()).toBeTruthy();

    const input = getInput();
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await fixture.whenStable();

    expect(getPanel()).toBeFalsy();
  });
});
