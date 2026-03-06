import { TestBed } from '@angular/core/testing';
import { AfterViewInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import { GlintPopoverComponent } from './popover.component';
import { cleanupOverlays } from '../testing/test-utils';
import type { GlintPopoverAlign } from '../core/overlay/overlay-positions';

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

@Component({
  selector: 'glint-test-popover-elementref-host',
  standalone: true,
  imports: [GlintPopoverComponent],
  template: `
    <button #btn class="trigger">Info</button>
    <glint-popover #popover [target]="btnRef()">
      <p>Popover content</p>
    </glint-popover>
  `,
})
class TestPopoverElementRefHostComponent implements AfterViewInit {
  popover = viewChild.required<GlintPopoverComponent>('popover');
  btn = viewChild.required<ElementRef>('btn');
  btnRef = signal<ElementRef | undefined>(undefined);

  ngAfterViewInit(): void {
    this.btnRef.set(this.btn());
  }
}

@Component({
  selector: 'glint-test-popover-component-ref-host',
  standalone: true,
  imports: [GlintPopoverComponent],
  template: `
    <button #btn class="trigger">Info</button>
    <glint-popover #popover [target]="componentTarget()">
      <p>Popover content</p>
    </glint-popover>
  `,
})
class TestPopoverComponentRefHostComponent implements AfterViewInit {
  popover = viewChild.required<GlintPopoverComponent>('popover');
  btn = viewChild.required<ElementRef>('btn');
  componentTarget = signal<{ elementRef: ElementRef } | undefined>(undefined);

  ngAfterViewInit(): void {
    this.componentTarget.set({ elementRef: this.btn() });
  }
}

@Component({
  selector: 'glint-test-popover-align-host',
  standalone: true,
  imports: [GlintPopoverComponent],
  template: `
    <button class="trigger" (click)="popover.toggle()">Info</button>
    <glint-popover #popover [align]="align()">
      <p>Aligned content</p>
    </glint-popover>
  `,
})
class TestPopoverAlignHostComponent {
  popover = viewChild.required<GlintPopoverComponent>('popover');
  align = signal<GlintPopoverAlign>('center');
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

  it('should accept ElementRef as target', async () => {
    TestBed.configureTestingModule({ imports: [TestPopoverElementRefHostComponent] });
    const fixture = TestBed.createComponent(TestPopoverElementRefHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel).toBeTruthy();
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });

  it('should accept component ref with elementRef as target', async () => {
    TestBed.configureTestingModule({ imports: [TestPopoverComponentRefHostComponent] });
    const fixture = TestBed.createComponent(TestPopoverComponentRefHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel).toBeTruthy();
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });

  it('should open with align="start"', async () => {
    TestBed.configureTestingModule({ imports: [TestPopoverAlignHostComponent] });
    const fixture = TestBed.createComponent(TestPopoverAlignHostComponent);
    fixture.componentInstance.align.set('start');
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel).toBeTruthy();
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });

  it('should open with align="end"', async () => {
    TestBed.configureTestingModule({ imports: [TestPopoverAlignHostComponent] });
    const fixture = TestBed.createComponent(TestPopoverAlignHostComponent);
    fixture.componentInstance.align.set('end');
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel).toBeTruthy();
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });

  it('should open with align="center" (default)', async () => {
    TestBed.configureTestingModule({ imports: [TestPopoverAlignHostComponent] });
    const fixture = TestBed.createComponent(TestPopoverAlignHostComponent);
    fixture.detectChanges();
    fixture.componentInstance.popover().open();
    fixture.detectChanges();
    await fixture.whenStable();
    const panel = document.querySelector('.popover-panel');
    expect(panel).toBeTruthy();
    fixture.componentInstance.popover().close();
    fixture.detectChanges();
  });
});
