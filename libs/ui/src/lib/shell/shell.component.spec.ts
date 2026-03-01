import { TestBed } from '@angular/core/testing';
import { Component, inject, signal } from '@angular/core';
import { GlintShellComponent } from './shell.component';
import { GlintShellSidebarComponent } from './shell-sidebar.component';
import { GlintShellHeaderComponent } from './shell-header.component';
import { GlintShellContentComponent } from './shell-content.component';
import { GLINT_SHELL_SIDEBAR, GlintShellSidebarHost } from './shell.model';

@Component({
  selector: 'glint-test-shell-host',
  standalone: true,
  imports: [
    GlintShellComponent,
    GlintShellSidebarComponent,
    GlintShellHeaderComponent,
    GlintShellContentComponent,
  ],
  template: `
    <glint-shell [breakpointCollapse]="breakpointCollapse">
      <glint-shell-sidebar
        [(collapsed)]="collapsed"
        [width]="width"
        [collapsedWidth]="collapsedWidth"
      >
        <div class="sidebar-nav">Nav items</div>
      </glint-shell-sidebar>
      <glint-shell-header [height]="headerHeight">
        <span class="header-title">App Title</span>
      </glint-shell-header>
      <glint-shell-content>
        <div class="main-content">Page content</div>
      </glint-shell-content>
    </glint-shell>
  `,
})
class TestShellHostComponent {
  collapsed = signal(false);
  width = '260px';
  collapsedWidth = '64px';
  headerHeight = '56px';
  breakpointCollapse = 0; // Disabled in tests
}

@Component({
  selector: 'glint-test-sidebar-child',
  standalone: true,
  template: `<span>child</span>`,
})
class TestSidebarChildComponent {
  sidebar = inject(GLINT_SHELL_SIDEBAR, { optional: true });
}

@Component({
  selector: 'glint-test-shell-di-host',
  standalone: true,
  imports: [
    GlintShellComponent,
    GlintShellSidebarComponent,
    GlintShellHeaderComponent,
    GlintShellContentComponent,
    TestSidebarChildComponent,
  ],
  template: `
    <glint-shell [breakpointCollapse]="0">
      <glint-shell-sidebar [(collapsed)]="collapsed">
        <glint-test-sidebar-child />
      </glint-shell-sidebar>
      <glint-shell-header />
      <glint-shell-content />
    </glint-shell>
  `,
})
class TestShellDIHostComponent {
  collapsed = signal(false);
}

describe('Shell Components', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestShellHostComponent,
        TestShellDIHostComponent,
      ],
    });
  });

  // --- Layout rendering ---

  it('should render sidebar, header, and content', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement;
    expect(el.querySelector('glint-shell-sidebar')).toBeTruthy();
    expect(el.querySelector('glint-shell-header')).toBeTruthy();
    expect(el.querySelector('glint-shell-content')).toBeTruthy();
  });

  it('should project sidebar content', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.sidebar-nav')?.textContent).toContain('Nav items');
  });

  it('should project header content', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.header-title')?.textContent).toContain('App Title');
  });

  it('should project main content', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.main-content')?.textContent).toContain('Page content');
  });

  // --- Grid structure ---

  it('should set --_sidebar-width CSS variable on shell', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const shell = fixture.nativeElement.querySelector('glint-shell') as HTMLElement;
    expect(shell.style.getPropertyValue('--_sidebar-width')).toBe('260px');
  });

  it('should update --_sidebar-width when collapsed', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    const shell = fixture.nativeElement.querySelector('glint-shell') as HTMLElement;
    expect(shell.style.getPropertyValue('--_sidebar-width')).toBe('64px');
  });

  it('should reflect custom width values', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.componentInstance.width = '300px';
    fixture.componentInstance.collapsedWidth = '80px';
    fixture.detectChanges();
    const shell = fixture.nativeElement.querySelector('glint-shell') as HTMLElement;
    expect(shell.style.getPropertyValue('--_sidebar-width')).toBe('300px');

    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    expect(shell.style.getPropertyValue('--_sidebar-width')).toBe('80px');
  });

  // --- Sidebar ---

  it('should set data-collapsed attribute when collapsed', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('glint-shell-sidebar') as HTMLElement;
    expect(sidebar.hasAttribute('data-collapsed')).toBe(false);

    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    expect(sidebar.hasAttribute('data-collapsed')).toBe(true);
  });

  it('should toggle collapsed via toggle() method', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const sidebar = fixture.debugElement.children[0].children[0].componentInstance as GlintShellSidebarComponent;
    expect(sidebar.collapsed()).toBe(false);
    sidebar.toggle();
    expect(sidebar.collapsed()).toBe(true);
    sidebar.toggle();
    expect(sidebar.collapsed()).toBe(false);
  });

  // --- ARIA roles ---

  it('should have role="navigation" on sidebar', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('glint-shell-sidebar');
    expect(sidebar.getAttribute('role')).toBe('navigation');
  });

  it('should have aria-label on sidebar', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const sidebar = fixture.nativeElement.querySelector('glint-shell-sidebar');
    expect(sidebar.getAttribute('aria-label')).toBe('Main navigation');
  });

  it('should have role="banner" on header', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('glint-shell-header');
    expect(header.getAttribute('role')).toBe('banner');
  });

  it('should have role="main" on content', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('glint-shell-content');
    expect(content.getAttribute('role')).toBe('main');
  });

  // --- Header height ---

  it('should apply header height', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('glint-shell-header') as HTMLElement;
    expect(header.style.blockSize).toBe('56px');
  });

  it('should apply custom header height', () => {
    const fixture = TestBed.createComponent(TestShellHostComponent);
    fixture.componentInstance.headerHeight = '72px';
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('glint-shell-header') as HTMLElement;
    expect(header.style.blockSize).toBe('72px');
  });

  // --- DI token ---

  it('should provide GLINT_SHELL_SIDEBAR token to children', () => {
    const fixture = TestBed.createComponent(TestShellDIHostComponent);
    fixture.detectChanges();
    const child = fixture.debugElement.query(
      (de) => de.componentInstance instanceof TestSidebarChildComponent
    )?.componentInstance as TestSidebarChildComponent;
    expect(child.sidebar).toBeTruthy();
    expect(child.sidebar!.collapsed()).toBe(false);
  });

  it('should reflect collapsed state through DI token', () => {
    const fixture = TestBed.createComponent(TestShellDIHostComponent);
    fixture.detectChanges();
    const child = fixture.debugElement.query(
      (de) => de.componentInstance instanceof TestSidebarChildComponent
    )?.componentInstance as TestSidebarChildComponent;

    fixture.componentInstance.collapsed.set(true);
    fixture.detectChanges();
    expect(child.sidebar!.collapsed()).toBe(true);
  });

  // --- Shell without sidebar ---

  it('should set --_sidebar-width to 0px when no sidebar is present', () => {
    @Component({
      selector: 'glint-test-no-sidebar',
      standalone: true,
      imports: [GlintShellComponent, GlintShellHeaderComponent, GlintShellContentComponent],
      template: `
        <glint-shell [breakpointCollapse]="0">
          <glint-shell-header />
          <glint-shell-content>Content</glint-shell-content>
        </glint-shell>
      `,
    })
    class TestNoSidebarComponent {}

    TestBed.configureTestingModule({ imports: [TestNoSidebarComponent] });
    const fixture = TestBed.createComponent(TestNoSidebarComponent);
    fixture.detectChanges();
    const shell = fixture.nativeElement.querySelector('glint-shell') as HTMLElement;
    expect(shell.style.getPropertyValue('--_sidebar-width')).toBe('0px');
  });
});
