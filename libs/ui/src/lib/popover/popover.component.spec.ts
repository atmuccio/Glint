import { TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { GlintPopoverComponent } from './popover.component';
import { cleanupOverlays } from '../testing/test-utils';

@Component({
  selector: 'glint-test-popover-host',
  standalone: true,
  imports: [GlintPopoverComponent],
  template: `
    <button class="trigger" (click)="popover.toggle()">Info</button>
    <glint-popover #popover>
      <p>Popover content</p>
    </glint-popover>
  `,
})
class TestPopoverHostComponent {
  popover = viewChild.required<GlintPopoverComponent>('popover');
}

describe('GlintPopoverComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestPopoverHostComponent] });
  });

  afterEach(() => {
    cleanupOverlays();
  });

  it('should open popover on toggle', async () => {
    const fixture = TestBed.createComponent(TestPopoverHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().toggle();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel).toBeTruthy();
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });

  it('should render content', async () => {
    const fixture = TestBed.createComponent(TestPopoverHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel?.textContent).toContain('Popover content');
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });

  it('should close on second toggle', async () => {
    const fixture = TestBed.createComponent(TestPopoverHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().toggle();
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.componentInstance.popover().toggle();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel).toBeNull();
  });

  it('should close on Escape key', async () => {
    const fixture = TestBed.createComponent(TestPopoverHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('.popover-panel')).toBeTruthy();

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('.popover-panel')).toBeNull();
  });

  it('should have dialog role', async () => {
    const fixture = TestBed.createComponent(TestPopoverHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('[role="dialog"]');
    expect(panel).toBeTruthy();
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });
});
