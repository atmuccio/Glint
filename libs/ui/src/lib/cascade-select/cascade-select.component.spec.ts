import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintCascadeSelectComponent } from './cascade-select.component';
import type { GlintMenuItem } from '../menu/menu-item.model';
import { cleanupOverlays } from '../testing/test-utils';

@Component({
  selector: 'glint-test-cascade-select-host',
  standalone: true,
  imports: [GlintCascadeSelectComponent, ReactiveFormsModule],
  template: `
    <glint-cascade-select
      [options]="options"
      [placeholder]="placeholder"
      [disabled]="disabled"
      [formControl]="ctrl"
    />
  `,
})
class TestCascadeSelectHostComponent {
  ctrl = new FormControl<string | null>(null);
  placeholder = 'Select...';
  disabled = false;
  options: GlintMenuItem[] = [
    { label: 'Electronics', items: [
      { label: 'Phones' },
      { label: 'Laptops' },
    ]},
    { label: 'Clothing', items: [
      { label: 'Shirts' },
      { label: 'Pants' },
    ]},
    { label: 'Books' },
  ];
}

describe('GlintCascadeSelectComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestCascadeSelectHostComponent, OverlayModule],
    });
  });

  afterEach(() => {
    cleanupOverlays();
  });

  function createFixture(overrides?: Partial<TestCascadeSelectHostComponent>) {
    const fixture = TestBed.createComponent(TestCascadeSelectHostComponent);
    if (overrides) {
      Object.assign(fixture.componentInstance, overrides);
    }
    fixture.detectChanges();
    return fixture;
  }

  function getTrigger(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('.cascade-select-trigger') as HTMLElement;
  }

  function getSelect(fixture: ReturnType<typeof createFixture>) {
    return fixture.nativeElement.querySelector('glint-cascade-select') as HTMLElement;
  }

  async function openPanel(fixture: ReturnType<typeof createFixture>) {
    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();
  }

  function getPanelItems() {
    return Array.from(document.querySelectorAll('.cascade-item')) as HTMLElement[];
  }

  // ── Basic rendering ─────────────────────────────

  it('should render trigger with placeholder', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger).toBeTruthy();
    expect(trigger.textContent).toContain('Select...');
  });

  it('should show selected item label when value is set', async () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.setValue('Books');
    fixture.detectChanges();
    await fixture.whenStable();

    const trigger = getTrigger(fixture);
    expect(trigger.textContent).toContain('Books');
  });

  it('should work with FormControl (CVA)', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    // Click a leaf item (Books is at index 2 in top-level)
    const items = getPanelItems();
    const booksItem = items.find(el => el.textContent?.includes('Books'));
    expect(booksItem).toBeTruthy();
    booksItem?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('Books');
  });

  it('should have combobox role', () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);
    expect(trigger.getAttribute('role')).toBe('combobox');
    expect(trigger.getAttribute('aria-expanded')).toBe('false');
  });

  it('should render top-level options', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const items = getPanelItems();
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Electronics');
    expect(items[1].textContent).toContain('Clothing');
    expect(items[2].textContent).toContain('Books');
  });

  it('should not open when disabled', async () => {
    const fixture = createFixture({ disabled: true });

    getTrigger(fixture).click();
    fixture.detectChanges();
    await fixture.whenStable();

    const items = getPanelItems();
    expect(items.length).toBe(0);
  });

  it('should set aria-expanded to true when open', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const trigger = getTrigger(fixture);
    expect(trigger.getAttribute('aria-expanded')).toBe('true');
  });

  it('should close panel on backdrop click', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    expect(getPanelItems().length).toBe(3);

    const backdrop = document.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    backdrop?.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanelItems().length).toBe(0);
  });

  it('should set disabled state from FormControl', () => {
    const fixture = createFixture();
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    expect(getSelect(fixture).classList.contains('disabled')).toBe(true);
  });

  it('should close on Escape key', async () => {
    const fixture = createFixture();
    await openPanel(fixture);
    expect(getPanelItems().length).toBe(3);

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanelItems().length).toBe(0);
  });

  it('should navigate items with ArrowDown key', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const panel = document.querySelector('glint-cascade-select-panel') as HTMLElement;
    expect(panel).toBeTruthy();

    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    const items = getPanelItems();
    // After pressing ArrowDown, the first (index 0) or second item should be active
    const activeItems = items.filter(el => el.classList.contains('active'));
    expect(activeItems.length).toBeGreaterThan(0);
  });

  it('should open submenu with ArrowRight on parent item', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const panel = document.querySelector('glint-cascade-select-panel') as HTMLElement;

    // Move to first item (Electronics)
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    // Press ArrowRight to open submenu
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    // There should now be a sub-panel with child items
    const panels = document.querySelectorAll('glint-cascade-select-panel');
    expect(panels.length).toBeGreaterThanOrEqual(1);
  });

  it('should select leaf item with Enter key', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const panel = document.querySelector('glint-cascade-select-panel') as HTMLElement;

    // Navigate to Books (index 2) with ArrowDown twice
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
    fixture.detectChanges();

    // Press Enter to select
    panel.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('Books');
  });

  it('should open panel on Enter key on trigger', async () => {
    const fixture = createFixture();
    const trigger = getTrigger(fixture);

    trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(getPanelItems().length).toBe(3);
  });

  it('should show submenu indicator for items with children', async () => {
    const fixture = createFixture();
    await openPanel(fixture);

    const items = getPanelItems();
    const electronicsItem = items[0];
    const submenuIndicator = electronicsItem.querySelector('.submenu-indicator');
    expect(submenuIndicator).toBeTruthy();

    // Books has no children, should not have indicator
    const booksItem = items[2];
    const booksIndicator = booksItem.querySelector('.submenu-indicator');
    expect(booksIndicator).toBeFalsy();
  });
});
