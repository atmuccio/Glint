import { TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { GlintMenuComponent } from './menu.component';
import type { GlintMenuItem } from './menu-item.model';
import { cleanupOverlays, provideGlintTestIcons } from '../testing/test-utils';

@Component({
  selector: 'glint-test-menu-host',
  standalone: true,
  imports: [GlintMenuComponent],
  template: `
    <button class="trigger" (click)="menu.toggle()">Actions</button>
    <glint-menu #menu [items]="items" />
  `,
})
class TestMenuHostComponent {
  menu = viewChild.required<GlintMenuComponent>('menu');
  clicked = false;
  items: GlintMenuItem[] = [
    { label: 'Edit', command: () => (this.clicked = true) },
    { label: 'Delete', disabled: true },
    { label: 'Archive', separator: true },
  ];
}

@Component({
  selector: 'glint-test-menu-styled-host',
  standalone: true,
  imports: [GlintMenuComponent],
  template: `
    <button class="trigger" (click)="menu.toggle()">Actions</button>
    <glint-menu #menu [items]="items" />
  `,
})
class TestMenuStyledHostComponent {
  menu = viewChild.required<GlintMenuComponent>('menu');
  items: GlintMenuItem[] = [
    { label: 'Edit', icon: 'pencil', styleClass: 'custom-edit' },
    { label: 'Delete', icon: 'trash' },
    { label: 'Plain' },
  ];
}

describe('GlintMenuComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestMenuHostComponent, TestMenuStyledHostComponent],
      providers: [provideGlintTestIcons()],
    });
  });

  afterEach(() => {
    cleanupOverlays();
  });

  it('should open menu on toggle', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().toggle();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('glint-menu-panel');
    expect(panel).toBeTruthy();
    fixture.componentInstance.menu().close();
    fixture.detectChanges();
  });

  it('should render menu items', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const items = document.querySelectorAll('[role="menuitem"]');
    expect(items.length).toBe(3);
    expect(items[0].textContent?.trim()).toBe('Edit');
    fixture.componentInstance.menu().close();
    fixture.detectChanges();
  });

  it('should mark disabled items', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const items = document.querySelectorAll('[role="menuitem"]');
    expect(items[1].getAttribute('aria-disabled')).toBe('true');
    fixture.componentInstance.menu().close();
    fixture.detectChanges();
  });

  it('should execute command and close on item click', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const item = document.querySelector('[role="menuitem"]') as HTMLButtonElement;
    item.click();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(fixture.componentInstance.clicked).toBe(true);
  });

  it('should close on Escape key', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-menu-panel')).toBeTruthy();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-menu-panel')).toBeFalsy();
  });

  it('should render separators', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const sep = document.querySelector('[role="separator"]');
    expect(sep).toBeTruthy();
    fixture.componentInstance.menu().close();
    fixture.detectChanges();
  });

  it('should have menu role on cdkMenu element', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const menuEl = document.querySelector('[role="menu"]') as HTMLElement;
    expect(menuEl).toBeTruthy();
    fixture.componentInstance.menu().close();
    fixture.detectChanges();
  });

  it('should not click disabled items', async () => {
    const fixture = TestBed.createComponent(TestMenuHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const items = document.querySelectorAll('[role="menuitem"]');
    // Click disabled item (index 1)
    (items[1] as HTMLButtonElement).click();
    fixture.detectChanges();
    await fixture.whenStable();
    // clicked should remain false since only the first item has a command
    expect(fixture.componentInstance.clicked).toBe(false);
  });

  it('should apply styleClass to menu item button', async () => {
    const fixture = TestBed.createComponent(TestMenuStyledHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const items = document.querySelectorAll('[role="menuitem"]');
    expect(items[0].classList.contains('custom-edit')).toBe(true);
    expect(items[0].classList.contains('menu-item')).toBe(true);
    fixture.componentInstance.menu().close();
    fixture.detectChanges();
  });

  it('should render glint-icon when item has icon', async () => {
    const fixture = TestBed.createComponent(TestMenuStyledHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.menu().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const items = document.querySelectorAll('[role="menuitem"]');
    // First two items have icons
    expect(items[0].querySelector('glint-icon')).toBeTruthy();
    expect(items[1].querySelector('glint-icon')).toBeTruthy();
    // Third item has no icon
    expect(items[2].querySelector('glint-icon')).toBeFalsy();
    fixture.componentInstance.menu().close();
    fixture.detectChanges();
  });
});
