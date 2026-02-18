import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintDockComponent } from './dock.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

@Component({
  selector: 'glint-test-dock-host',
  standalone: true,
  imports: [GlintDockComponent],
  template: `<glint-dock [items]="items" [position]="position" />`,
})
class TestDockHostComponent {
  items: GlintMenuItem[] = [
    { label: 'Home', icon: 'H', command: vi.fn() },
    { label: 'Search', icon: 'S', command: vi.fn() },
    { label: 'Settings', disabled: true, command: vi.fn() },
  ];
  position: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
}

describe('GlintDockComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestDockHostComponent] });
  });

  it('should render dock items', () => {
    const fixture = TestBed.createComponent(TestDockHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.dock-item');
    expect(items.length).toBe(3);
  });

  it('should have menu role', () => {
    const fixture = TestBed.createComponent(TestDockHostComponent);
    fixture.detectChanges();
    const dock = fixture.nativeElement.querySelector('.dock') as HTMLElement;
    expect(dock.getAttribute('role')).toBe('menu');
  });

  it('should have menuitem role on items', () => {
    const fixture = TestBed.createComponent(TestDockHostComponent);
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.dock-item');
    items.forEach((item: HTMLElement) => {
      expect(item.getAttribute('role')).toBe('menuitem');
    });
  });

  it('should call command on item click', () => {
    const fixture = TestBed.createComponent(TestDockHostComponent);
    const spy = vi.fn();
    fixture.componentInstance.items[0].command = spy;
    fixture.detectChanges();
    const item = fixture.nativeElement.querySelector('.dock-item') as HTMLButtonElement;
    item.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should not call command on disabled item click', () => {
    const fixture = TestBed.createComponent(TestDockHostComponent);
    const spy = vi.fn();
    fixture.componentInstance.items[2].command = spy;
    fixture.detectChanges();
    const items = fixture.nativeElement.querySelectorAll('.dock-item');
    (items[2] as HTMLButtonElement).click();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should render icon or first letter of label', () => {
    const fixture = TestBed.createComponent(TestDockHostComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.dock-icon');
    expect(icons[0].textContent?.trim()).toBe('H');
    expect(icons[1].textContent?.trim()).toBe('S');
    // Third item has no icon, should show first letter of label
    expect(icons[2].textContent?.trim()).toBe('S'); // 'Settings'.charAt(0) = 'S'
  });
});
