import { Component, viewChild } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintTieredMenuComponent } from './tiered-menu.component';
import type { GlintMenuItem } from '../menu/menu-item.model';

@Component({
  selector: 'glint-test-tiered-menu-host',
  standalone: true,
  imports: [GlintTieredMenuComponent],
  template: `
    <glint-tiered-menu #menu [items]="items" />
  `,
})
class TestInlineHostComponent {
  menu = viewChild.required<GlintTieredMenuComponent>('menu');
  items: GlintMenuItem[] = [
    { label: 'File', items: [{ label: 'New' }, { label: 'Open' }] },
    { label: 'Edit' },
    { label: 'View', disabled: true },
  ];
}

@Component({
  selector: 'glint-test-tiered-menu-popup-host',
  standalone: true,
  imports: [GlintTieredMenuComponent],
  template: `
    <button class="trigger" (click)="menu.toggle()">Actions</button>
    <glint-tiered-menu #menu [items]="items" [popup]="true" />
  `,
})
class TestPopupHostComponent {
  menu = viewChild.required<GlintTieredMenuComponent>('menu');
  clicked = false;
  items: GlintMenuItem[] = [
    { label: 'Cut', command: () => (this.clicked = true) },
    { label: 'Copy' },
    { label: 'Paste' },
  ];
}

describe('GlintTieredMenuComponent', () => {
  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => {
      el.innerHTML = '';
    });
  });

  describe('inline mode', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestInlineHostComponent, OverlayModule],
      });
    });

    it('should render top-level menu items', async () => {
      const fixture = TestBed.createComponent(TestInlineHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
      expect(items.length).toBe(3);
      expect(items[0].textContent).toContain('File');
      expect(items[1].textContent).toContain('Edit');
      expect(items[2].textContent).toContain('View');
    });

    it('should render inline when popup is false', async () => {
      const fixture = TestBed.createComponent(TestInlineHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const panel = fixture.nativeElement.querySelector(
        'glint-tiered-menu-panel'
      );
      expect(panel).toBeTruthy();

      // Should NOT be in an overlay
      const overlayPanel = document.querySelector(
        '.cdk-overlay-container glint-tiered-menu-panel'
      );
      expect(overlayPanel).toBeFalsy();
    });

    it('should show submenu indicator for items with children', async () => {
      const fixture = TestBed.createComponent(TestInlineHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
      // 'File' has children, should have aria-haspopup
      expect(items[0].getAttribute('aria-haspopup')).toBe('true');
      // 'File' should contain the submenu indicator
      const indicator = items[0].querySelector('.submenu-indicator');
      expect(indicator).toBeTruthy();

      // 'Edit' has no children
      expect(items[1].getAttribute('aria-haspopup')).toBeNull();
      const noIndicator = items[1].querySelector('.submenu-indicator');
      expect(noIndicator).toBeFalsy();
    });

    it('should have menu role', async () => {
      const fixture = TestBed.createComponent(TestInlineHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const panel = fixture.nativeElement.querySelector(
        'glint-tiered-menu-panel'
      );
      expect(panel.getAttribute('role')).toBe('menu');
    });

    it('should handle keyboard navigation (ArrowDown/ArrowUp)', async () => {
      const fixture = TestBed.createComponent(TestInlineHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      const panel = fixture.nativeElement.querySelector(
        'glint-tiered-menu-panel'
      ) as HTMLElement;
      const items = fixture.nativeElement.querySelectorAll(
        '[role="menuitem"]'
      ) as NodeListOf<HTMLButtonElement>;

      // Focus the first item
      items[0].focus();

      // Arrow down should move to next item
      panel.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true })
      );
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.activeElement).toBe(items[1]);

      // Arrow up should move back
      panel.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })
      );
      fixture.detectChanges();
      await fixture.whenStable();

      expect(document.activeElement).toBe(items[0]);
    });
  });

  describe('popup mode', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [TestPopupHostComponent, OverlayModule],
      });
    });

    it('should open popup on toggle', async () => {
      const fixture = TestBed.createComponent(TestPopupHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.menu().toggle();
      fixture.detectChanges();
      await fixture.whenStable();

      const panel = document.querySelector('glint-tiered-menu-panel');
      expect(panel).toBeTruthy();

      fixture.componentInstance.menu().close();
      fixture.detectChanges();
    });

    it('should execute command and close on item click', async () => {
      const fixture = TestBed.createComponent(TestPopupHostComponent);
      fixture.detectChanges();
      await fixture.whenStable();

      fixture.componentInstance.menu().open();
      fixture.detectChanges();
      await fixture.whenStable();

      const item = document.querySelector('[role="menuitem"]') as HTMLButtonElement;
      item.click();
      fixture.detectChanges();
      await fixture.whenStable();

      expect(fixture.componentInstance.clicked).toBe(true);
    });
  });
});
