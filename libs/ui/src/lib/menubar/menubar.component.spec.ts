import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintMenuBarComponent } from './menubar.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

@Component({
  selector: 'glint-test-menubar-host',
  standalone: true,
  imports: [GlintMenuBarComponent],
  template: `<glint-menubar [items]="items" />`,
})
class TestMenuBarHostComponent {
  items: GlintMenuItem[] = [
    { label: 'File', items: [
      { label: 'New' },
      { label: 'Open' },
    ]},
    { label: 'Edit', items: [
      { label: 'Undo' },
      { label: 'Redo' },
    ]},
    { label: 'Help' },
  ];
}

describe('GlintMenuBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestMenuBarHostComponent] });
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach(el => {
      el.innerHTML = '';
    });
  });

  it('should render top-level menu items horizontally', () => {
    const fixture = TestBed.createComponent(TestMenuBarHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.menubar-item');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent).toContain('File');
    expect(buttons[1].textContent).toContain('Edit');
    expect(buttons[2].textContent).toContain('Help');
  });

  it('should have menubar role', () => {
    const fixture = TestBed.createComponent(TestMenuBarHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-menubar');
    expect(host.getAttribute('role')).toBe('menubar');
  });

  it('should show dropdown on click', async () => {
    const fixture = TestBed.createComponent(TestMenuBarHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.menubar-item') as NodeListOf<HTMLButtonElement>;
    buttons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    const menuItems = document.querySelectorAll('[role="menuitem"]');
    // 3 top-level + 2 dropdown items
    const dropdownItems = Array.from(menuItems).filter(
      el => !el.classList.contains('menubar-item')
    );
    expect(dropdownItems.length).toBe(2);
    // Clean up
    buttons[0].click();
    fixture.detectChanges();
  });

  it('should close dropdown on second click', async () => {
    const fixture = TestBed.createComponent(TestMenuBarHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.menubar-item') as NodeListOf<HTMLButtonElement>;
    // Open
    buttons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    // Close
    buttons[0].click();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('glint-menu-panel');
    expect(panel).toBeFalsy();
  });

  it('should have menu items with menuitem role', () => {
    const fixture = TestBed.createComponent(TestMenuBarHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.menubar-item');
    buttons.forEach((btn: HTMLElement) => {
      expect(btn.getAttribute('role')).toBe('menuitem');
    });
  });

  it('should display caret for items with children', () => {
    const fixture = TestBed.createComponent(TestMenuBarHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.menubar-item');
    // File and Edit have children -> caret
    const fileCaret = buttons[0].querySelector('.caret');
    const editCaret = buttons[1].querySelector('.caret');
    const helpCaret = buttons[2].querySelector('.caret');
    expect(fileCaret).toBeTruthy();
    expect(editCaret).toBeTruthy();
    expect(helpCaret).toBeFalsy();
  });
});
