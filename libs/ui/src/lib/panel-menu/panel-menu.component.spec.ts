import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintPanelMenuComponent } from './panel-menu.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

@Component({
  selector: 'glint-test-panel-menu-host',
  standalone: true,
  imports: [GlintPanelMenuComponent],
  template: `<glint-panel-menu [items]="items" [multiple]="multiple" />`,
})
class TestPanelMenuHostComponent {
  items: GlintMenuItem[] = [
    {
      label: 'File',
      items: [
        { label: 'New', command: vi.fn() },
        { label: 'Open', command: vi.fn() },
      ],
    },
    {
      label: 'Edit',
      items: [
        { label: 'Undo', command: vi.fn() },
        { label: 'Redo', command: vi.fn() },
      ],
    },
    {
      label: 'Help',
      items: [
        { label: 'About', command: vi.fn() },
      ],
    },
  ];
  multiple = false;
}

describe('GlintPanelMenuComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestPanelMenuHostComponent] });
  });

  it('should render top-level items', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('File');
    expect(headers[1].textContent).toContain('Edit');
    expect(headers[2].textContent).toContain('Help');
  });

  it('should expand item on click', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[0].click();
    fixture.detectChanges();
    const submenu = fixture.nativeElement.querySelector('.panel-menu-submenu');
    expect(submenu).toBeTruthy();
  });

  it('should collapse item on second click', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.panel-menu-submenu')).toBeTruthy();
    headers[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.panel-menu-submenu')).toBeFalsy();
  });

  it('should show children when expanded', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[0].click();
    fixture.detectChanges();
    const children = fixture.nativeElement.querySelectorAll('.panel-menu-child');
    expect(children.length).toBe(2);
    expect(children[0].textContent).toContain('New');
    expect(children[1].textContent).toContain('Open');
  });

  it('should call command on child click', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    const spy = vi.fn();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    fixture.componentInstance.items[0].items![0].command = spy;
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[0].click();
    fixture.detectChanges();
    const child = fixture.nativeElement.querySelector('.panel-menu-child') as HTMLButtonElement;
    child.click();
    expect(spy).toHaveBeenCalled();
  });

  it('should support multiple expanded when multiple is true', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    const submenus = fixture.nativeElement.querySelectorAll('.panel-menu-submenu');
    expect(submenus.length).toBe(2);
  });

  it('should only allow one expanded at a time when multiple is false', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[0].click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.panel-menu-submenu').length).toBe(1);
    headers[1].click();
    fixture.detectChanges();
    const submenus = fixture.nativeElement.querySelectorAll('.panel-menu-submenu');
    expect(submenus.length).toBe(1);
    const children = fixture.nativeElement.querySelectorAll('.panel-menu-child');
    expect(children[0].textContent).toContain('Undo');
  });
});
