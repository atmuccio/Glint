import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintContextMenuDirective } from './context-menu.directive';
import type { GlintMenuItem } from '../menu/menu-item.model';

@Component({
  selector: 'glint-test-context-menu-host',
  standalone: true,
  imports: [GlintContextMenuDirective],
  template: `
    <div [glintContextMenu]="items" class="target" style="width: 200px; height: 200px;">
      Right-click me
    </div>
  `,
})
class TestContextMenuHostComponent {
  clicked = false;
  items: GlintMenuItem[] = [
    { label: 'Cut', command: () => (this.clicked = true) },
    { label: 'Copy' },
    { label: 'Paste', disabled: true },
  ];
}

function createContextMenuEvent(x = 100, y = 100): MouseEvent {
  return new MouseEvent('contextmenu', {
    clientX: x,
    clientY: y,
    bubbles: true,
    cancelable: true,
  });
}

describe('GlintContextMenuDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestContextMenuHostComponent, OverlayModule],
    });
  });

  afterEach(() => {
    document.querySelectorAll('.cdk-overlay-container').forEach((el) => {
      el.innerHTML = '';
    });
  });

  it('should open context menu on right-click', async () => {
    const fixture = TestBed.createComponent(TestContextMenuHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    target.dispatchEvent(createContextMenuEvent());
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = document.querySelector('glint-menu-panel');
    expect(panel).toBeTruthy();
  });

  it('should close on backdrop click', async () => {
    const fixture = TestBed.createComponent(TestContextMenuHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    target.dispatchEvent(createContextMenuEvent());
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-menu-panel')).toBeTruthy();

    const backdrop = document.querySelector(
      '.cdk-overlay-backdrop'
    ) as HTMLElement;
    backdrop.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-menu-panel')).toBeFalsy();
  });

  it('should have menu role on panel', async () => {
    const fixture = TestBed.createComponent(TestContextMenuHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    target.dispatchEvent(createContextMenuEvent());
    fixture.detectChanges();
    await fixture.whenStable();

    const panel = document.querySelector('glint-menu-panel');
    expect(panel).toBeTruthy();
    // CdkMenu adds role="menu" on the inner menu container
    const menu = panel?.querySelector('[role="menu"]') ?? panel;
    expect(menu?.getAttribute('role')).toBe('menu');
  });

  it('should close on Escape key', async () => {
    const fixture = TestBed.createComponent(TestContextMenuHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    target.dispatchEvent(createContextMenuEvent());
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-menu-panel')).toBeTruthy();

    // CDK overlays listen for keydown events on the document
    const escapeEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
    });
    document.body.dispatchEvent(escapeEvent);
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-menu-panel')).toBeFalsy();
  });

  it('should call item command on click', async () => {
    const fixture = TestBed.createComponent(TestContextMenuHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const target = fixture.nativeElement.querySelector('.target') as HTMLElement;
    target.dispatchEvent(createContextMenuEvent());
    fixture.detectChanges();
    await fixture.whenStable();

    const item = document.querySelector('[role="menuitem"]') as HTMLButtonElement;
    item.click();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.clicked).toBe(true);
    // Should also close the menu
    expect(document.querySelector('glint-menu-panel')).toBeFalsy();
  });
});
