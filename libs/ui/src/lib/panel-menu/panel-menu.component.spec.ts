import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { GlintPanelMenuComponent } from './panel-menu.component';
import type { GlintMenuItem } from '../menu/menu-item.model';
import { GLINT_SHELL_SIDEBAR, GlintShellSidebarHost } from '../shell/shell.model';

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

@Component({
  selector: 'glint-test-panel-menu-icons-host',
  standalone: true,
  imports: [GlintPanelMenuComponent],
  template: `<glint-panel-menu [items]="items" />`,
})
class TestPanelMenuIconsHostComponent {
  items: GlintMenuItem[] = [
    {
      label: 'Dashboard',
      icon: '&#9670;',
      items: [
        { label: 'Overview', icon: '&#9679;' },
      ],
    },
    {
      label: 'Settings',
      icon: '&#9881;',
      items: [],
    },
  ];
}

@Component({
  selector: 'glint-test-panel-menu-collapsed-host',
  standalone: true,
  imports: [GlintPanelMenuComponent],
  providers: [
    {
      provide: GLINT_SHELL_SIDEBAR,
      useFactory: () => ({
        collapsed: signal(true),
        width: signal('260px'),
        collapsedWidth: signal('64px'),
      } satisfies GlintShellSidebarHost),
    },
  ],
  template: `<glint-panel-menu [items]="items" />`,
})
class TestPanelMenuCollapsedHostComponent {
  items: GlintMenuItem[] = [
    {
      label: 'Dashboard',
      icon: '&#9670;',
      items: [{ label: 'Overview' }],
    },
    {
      label: 'Settings',
      icon: '&#9881;',
      items: [],
    },
  ];
}

@Component({
  selector: 'glint-test-panel-menu-router-host',
  standalone: true,
  imports: [GlintPanelMenuComponent],
  template: `<glint-panel-menu [items]="items" />`,
})
class TestPanelMenuRouterHostComponent {
  items: GlintMenuItem[] = [
    {
      label: 'Home',
      routerLink: '/home',
    },
    {
      label: 'Products',
      items: [
        { label: 'Catalog', routerLink: '/products/catalog' },
        { label: 'Pricing', command: vi.fn() },
      ],
    },
  ];
}

describe('GlintPanelMenuComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestPanelMenuHostComponent,
        TestPanelMenuIconsHostComponent,
        TestPanelMenuCollapsedHostComponent,
        TestPanelMenuRouterHostComponent,
      ],
      providers: [
        provideRouter([]),
      ],
    });
  });

  // --- Existing tests ---

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

  // --- Icon rendering ---

  it('should render icons when provided', () => {
    const fixture = TestBed.createComponent(TestPanelMenuIconsHostComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.panel-menu-icon');
    expect(icons.length).toBe(2);
  });

  it('should render child icons when expanded', () => {
    const fixture = TestBed.createComponent(TestPanelMenuIconsHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[0].click();
    fixture.detectChanges();
    const childIcons = fixture.nativeElement.querySelectorAll('.panel-menu-child .panel-menu-icon');
    expect(childIcons.length).toBe(1);
  });

  it('should not render icon element when icon is not provided', () => {
    const fixture = TestBed.createComponent(TestPanelMenuHostComponent);
    fixture.detectChanges();
    const icons = fixture.nativeElement.querySelectorAll('.panel-menu-icon');
    expect(icons.length).toBe(0);
  });

  // --- Collapsed mode ---

  it('should set data-collapsed attribute when sidebar is collapsed', () => {
    const fixture = TestBed.createComponent(TestPanelMenuCollapsedHostComponent);
    fixture.detectChanges();
    const menu = fixture.nativeElement.querySelector('glint-panel-menu');
    expect(menu.hasAttribute('data-collapsed')).toBe(true);
  });

  it('should still render labels in DOM when collapsed (hidden via CSS)', () => {
    const fixture = TestBed.createComponent(TestPanelMenuCollapsedHostComponent);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.panel-menu-label');
    expect(labels.length).toBeGreaterThan(0);
  });

  // --- Router link items ---

  it('should render routerLink items as anchor elements', () => {
    const fixture = TestBed.createComponent(TestPanelMenuRouterHostComponent);
    fixture.detectChanges();
    const anchors = fixture.nativeElement.querySelectorAll('a.panel-menu-header');
    expect(anchors.length).toBe(1);
    expect(anchors[0].textContent).toContain('Home');
  });

  it('should render child routerLink items as anchor elements', () => {
    const fixture = TestBed.createComponent(TestPanelMenuRouterHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.panel-menu-header');
    headers[1].click();
    fixture.detectChanges();
    const childAnchors = fixture.nativeElement.querySelectorAll('a.panel-menu-child');
    expect(childAnchors.length).toBe(1);
    expect(childAnchors[0].textContent).toContain('Catalog');
    const childButtons = fixture.nativeElement.querySelectorAll('button.panel-menu-child');
    expect(childButtons.length).toBe(1);
    expect(childButtons[0].textContent).toContain('Pricing');
  });
});
