import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { GlintTabMenuComponent } from './tab-menu.component';
import type { GlintMenuItem } from '../menu/menu-item.model';
import { provideGlintTestIcons } from '../testing/test-utils';

@Component({
  selector: 'glint-test-tab-menu-host',
  standalone: true,
  imports: [GlintTabMenuComponent],
  template: `<glint-tab-menu [items]="items()" />`,
})
class TestTabMenuHostComponent {
  items = signal<GlintMenuItem[]>([
    { label: 'Home', routerLink: '/home' },
    { label: 'Products', routerLink: '/products' },
    { label: 'About', command: vi.fn() },
  ]);
}

@Component({
  selector: 'glint-test-tab-menu-icons-host',
  standalone: true,
  imports: [GlintTabMenuComponent],
  template: `<glint-tab-menu [items]="items()" />`,
})
class TestTabMenuIconsHostComponent {
  items = signal<GlintMenuItem[]>([
    { label: 'Home', routerLink: '/home', icon: 'star' },
    { label: 'Settings', command: vi.fn(), icon: 'pencil' },
    { label: 'Plain', routerLink: '/plain' },
  ]);
}

@Component({
  selector: 'glint-test-tab-menu-disabled-host',
  standalone: true,
  imports: [GlintTabMenuComponent],
  template: `<glint-tab-menu [items]="items()" />`,
})
class TestTabMenuDisabledHostComponent {
  items = signal<GlintMenuItem[]>([
    { label: 'Active', routerLink: '/active' },
    { label: 'Disabled', routerLink: '/disabled', disabled: true },
    { label: 'Also Active', command: vi.fn() },
  ]);
}

@Component({
  selector: 'glint-test-tab-menu-visibility-host',
  standalone: true,
  imports: [GlintTabMenuComponent],
  template: `<glint-tab-menu [items]="items()" />`,
})
class TestTabMenuVisibilityHostComponent {
  items = signal<GlintMenuItem[]>([
    { label: 'Visible', routerLink: '/visible' },
    { label: 'Hidden', routerLink: '/hidden', visible: false },
    { label: 'Also Visible', routerLink: '/also-visible' },
  ]);
}

describe('GlintTabMenuComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestTabMenuHostComponent,
        TestTabMenuIconsHostComponent,
        TestTabMenuDisabledHostComponent,
        TestTabMenuVisibilityHostComponent,
      ],
      providers: [
        provideRouter([]),
        provideGlintTestIcons(),
      ],
    });
  });

  // --- Rendering ---

  it('should render all items', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.tab-item');
    expect(items.length).toBe(3);
    expect(items[0].textContent).toContain('Home');
    expect(items[1].textContent).toContain('Products');
    expect(items[2].textContent).toContain('About');
  });

  it('should render routerLink items as anchor elements', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const anchors = fixture.nativeElement.querySelectorAll('a.tab-item');
    expect(anchors.length).toBe(2);
    expect(anchors[0].textContent).toContain('Home');
    expect(anchors[1].textContent).toContain('Products');
  });

  it('should render command items as button elements', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button.tab-item');
    expect(buttons.length).toBe(1);
    expect(buttons[0].textContent).toContain('About');
  });

  it('should call command on button click', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button.tab-item') as HTMLButtonElement;
    button.click();
    expect(fixture.componentInstance.items()[2].command).toHaveBeenCalled();
  });

  // --- Disabled ---

  it('should add disabled class and aria-disabled on disabled items', () => {
    const fixture = TestBed.createComponent(TestTabMenuDisabledHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.tab-item');
    expect(items[1].classList.contains('disabled')).toBe(true);
    expect(items[1].getAttribute('aria-disabled')).toBe('true');
  });

  it('should not call command on disabled button click', () => {
    const spy = vi.fn();
    const fixture = TestBed.createComponent(TestTabMenuDisabledHostComponent);
    fixture.componentInstance.items.set([
      { label: 'Active', routerLink: '/active' },
      { label: 'Disabled Btn', command: spy, disabled: true },
      { label: 'Also Active', command: vi.fn() },
    ]);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('button.tab-item');
    buttons[0].click();
    expect(spy).not.toHaveBeenCalled();
  });

  // --- Visibility ---

  it('should hide items with visible === false', () => {
    const fixture = TestBed.createComponent(TestTabMenuVisibilityHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.tab-item');
    expect(items.length).toBe(2);
    expect(items[0].textContent).toContain('Visible');
    expect(items[1].textContent).toContain('Also Visible');
  });

  // --- Icons ---

  it('should render icons when provided', () => {
    const fixture = TestBed.createComponent(TestTabMenuIconsHostComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.tab-item glint-icon');
    expect(icons.length).toBe(2);
  });

  it('should not render icon element when icon is not provided', () => {
    const fixture = TestBed.createComponent(TestTabMenuIconsHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.tab-item');
    // The third item ("Plain") has no icon
    const plainItem = items[2];
    const icon = plainItem.querySelector('glint-icon');
    expect(icon).toBeNull();
  });

  // --- ARIA roles ---

  it('should have tablist role on container', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    expect(tablist).toBeTruthy();
  });

  it('should have tab role on each item', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tabs = fixture.nativeElement.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
  });

  // --- Keyboard navigation ---

  it('should move focus right with ArrowRight', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const items = fixture.nativeElement.querySelectorAll('.tab-item');

    // Focus first tab
    items[0].focus();

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    // Second tab should now have tabindex=0
    expect(items[1].getAttribute('tabindex')).toBe('0');
    expect(items[0].getAttribute('tabindex')).toBe('-1');
  });

  it('should move focus left with ArrowLeft', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const items = fixture.nativeElement.querySelectorAll('.tab-item');

    // Set focused index to 1 first
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(items[1].getAttribute('tabindex')).toBe('0');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();

    expect(items[0].getAttribute('tabindex')).toBe('0');
    expect(items[1].getAttribute('tabindex')).toBe('-1');
  });

  it('should wrap from last to first with ArrowRight', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const items = fixture.nativeElement.querySelectorAll('.tab-item');

    // Navigate to last
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(items[2].getAttribute('tabindex')).toBe('0');

    // Wrap around
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(items[0].getAttribute('tabindex')).toBe('0');
  });

  it('should wrap from first to last with ArrowLeft', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const items = fixture.nativeElement.querySelectorAll('.tab-item');

    // Focus is on first (index 0), press ArrowLeft should wrap to last
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(items[2].getAttribute('tabindex')).toBe('0');
  });

  it('should move to first with Home', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const items = fixture.nativeElement.querySelectorAll('.tab-item');

    // Move to last first
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
    fixture.detectChanges();
    expect(items[0].getAttribute('tabindex')).toBe('0');
  });

  it('should move to last with End', () => {
    const fixture = TestBed.createComponent(TestTabMenuHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const items = fixture.nativeElement.querySelectorAll('.tab-item');

    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
    fixture.detectChanges();
    expect(items[2].getAttribute('tabindex')).toBe('0');
  });

  it('should skip disabled items during keyboard navigation', () => {
    const fixture = TestBed.createComponent(TestTabMenuDisabledHostComponent);
    fixture.detectChanges();
    const tablist = fixture.nativeElement.querySelector('[role="tablist"]');
    const items = fixture.nativeElement.querySelectorAll('.tab-item');

    // ArrowRight from index 0 should skip disabled index 1 and land on index 2
    tablist.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(items[2].getAttribute('tabindex')).toBe('0');
    expect(items[1].getAttribute('tabindex')).toBe('-1');
  });
});
