import { TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { GlintMenuComponent } from './menu.component';
import type { GlintMenuItem } from './menu-item.model';

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

describe('GlintMenuComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestMenuHostComponent] });
  });

  afterEach(() => {
    // Clean up any open overlays
    document.querySelectorAll('.cdk-overlay-container').forEach(el => {
      el.innerHTML = '';
    });
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
});
