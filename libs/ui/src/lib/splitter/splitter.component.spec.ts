import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import {
  GlintSplitterComponent,
  GlintSplitterPanelComponent,
} from './splitter.component';

@Component({
  selector: 'glint-test-splitter-host',
  standalone: true,
  imports: [GlintSplitterComponent, GlintSplitterPanelComponent],
  template: `
    <glint-splitter [layout]="layout" [gutterSize]="gutterSize" (resizeEnd)="onResizeEnd($event)">
      <glint-splitter-panel [size]="size1" [minSize]="minSize1">Panel 1</glint-splitter-panel>
      <glint-splitter-panel [size]="size2" [minSize]="minSize2">Panel 2</glint-splitter-panel>
    </glint-splitter>
  `,
})
class TestSplitterHostComponent {
  layout: 'horizontal' | 'vertical' = 'horizontal';
  gutterSize = 4;
  size1: number | undefined = undefined;
  size2: number | undefined = undefined;
  minSize1 = 0;
  minSize2 = 0;
  lastResizeEnd: { sizes: number[] } | null = null;

  onResizeEnd(event: { sizes: number[] }): void {
    this.lastResizeEnd = event;
  }
}

@Component({
  selector: 'glint-test-splitter-sized-host',
  standalone: true,
  imports: [GlintSplitterComponent, GlintSplitterPanelComponent],
  template: `
    <glint-splitter>
      <glint-splitter-panel [size]="30">Left</glint-splitter-panel>
      <glint-splitter-panel [size]="70">Right</glint-splitter-panel>
    </glint-splitter>
  `,
})
class TestSplitterSizedHostComponent {}

@Component({
  selector: 'glint-test-splitter-three-host',
  standalone: true,
  imports: [GlintSplitterComponent, GlintSplitterPanelComponent],
  template: `
    <glint-splitter>
      <glint-splitter-panel>A</glint-splitter-panel>
      <glint-splitter-panel>B</glint-splitter-panel>
      <glint-splitter-panel>C</glint-splitter-panel>
    </glint-splitter>
  `,
})
class TestSplitterThreeHostComponent {}

describe('GlintSplitterComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestSplitterHostComponent,
        TestSplitterSizedHostComponent,
        TestSplitterThreeHostComponent,
      ],
    });
  });

  it('should render panels', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.detectChanges();
    const panels = fixture.nativeElement.querySelectorAll('.splitter-panel');
    expect(panels.length).toBe(2);
    expect(panels[0].textContent?.trim()).toBe('Panel 1');
    expect(panels[1].textContent?.trim()).toBe('Panel 2');
  });

  it('should render gutters between panels', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.detectChanges();
    const gutters = fixture.nativeElement.querySelectorAll('.splitter-gutter');
    expect(gutters.length).toBe(1);
  });

  it('should render two gutters between three panels', () => {
    const fixture = TestBed.createComponent(TestSplitterThreeHostComponent);
    fixture.detectChanges();
    const gutters = fixture.nativeElement.querySelectorAll('.splitter-gutter');
    expect(gutters.length).toBe(2);
  });

  it('should set initial sizes from panel inputs', () => {
    const fixture = TestBed.createComponent(TestSplitterSizedHostComponent);
    fixture.detectChanges();
    const splitter = fixture.debugElement.children[0].componentInstance as GlintSplitterComponent;
    expect(splitter.panelSizes()).toEqual([30, 70]);
  });

  it('should distribute sizes equally when not specified', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.detectChanges();
    const splitter = fixture.debugElement.children[0].componentInstance as GlintSplitterComponent;
    expect(splitter.panelSizes()).toEqual([50, 50]);
  });

  it('should distribute three panels equally when sizes not specified', () => {
    const fixture = TestBed.createComponent(TestSplitterThreeHostComponent);
    fixture.detectChanges();
    const splitter = fixture.debugElement.children[0].componentInstance as GlintSplitterComponent;
    const sizes = splitter.panelSizes();
    expect(sizes.length).toBe(3);
    expect(sizes[0]).toBeCloseTo(33.333, 2);
    expect(sizes[1]).toBeCloseTo(33.333, 2);
    expect(sizes[2]).toBeCloseTo(33.333, 2);
  });

  it('should have separator role on gutter', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.detectChanges();
    const gutter = fixture.nativeElement.querySelector('.splitter-gutter') as HTMLElement;
    expect(gutter.getAttribute('role')).toBe('separator');
    expect(gutter.getAttribute('tabindex')).toBe('0');
  });

  it('should apply horizontal layout by default', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-splitter') as HTMLElement;
    expect(host.style.flexDirection).toBe('row');
    const gutter = fixture.nativeElement.querySelector('.splitter-gutter') as HTMLElement;
    expect(gutter.classList.contains('horizontal')).toBe(true);
    expect(gutter.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('should apply vertical layout when specified', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.componentInstance.layout = 'vertical';
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-splitter') as HTMLElement;
    expect(host.style.flexDirection).toBe('column');
    const gutter = fixture.nativeElement.querySelector('.splitter-gutter') as HTMLElement;
    expect(gutter.classList.contains('vertical')).toBe(true);
    expect(gutter.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should emit resizeEnd on keyboard resize', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.detectChanges();
    const gutter = fixture.nativeElement.querySelector('.splitter-gutter') as HTMLElement;

    gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();

    const result = fixture.componentInstance.lastResizeEnd;
    expect(result).toBeTruthy();
    expect(result?.sizes.length).toBe(2);
    expect(result?.sizes[0]).toBe(51);
    expect(result?.sizes[1]).toBe(49);
  });

  it('should respect minSize constraints on keyboard resize', () => {
    const fixture = TestBed.createComponent(TestSplitterHostComponent);
    fixture.componentInstance.size1 = 5;
    fixture.componentInstance.size2 = 95;
    fixture.componentInstance.minSize1 = 5;
    fixture.componentInstance.minSize2 = 10;
    fixture.detectChanges();

    const splitter = fixture.debugElement.children[0].componentInstance as GlintSplitterComponent;
    const gutter = fixture.nativeElement.querySelector('.splitter-gutter') as HTMLElement;

    // Try to shrink panel 1 below its minimum
    gutter.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();

    const sizes = splitter.panelSizes();
    expect(sizes[0]).toBeGreaterThanOrEqual(5);
    expect(sizes[1]).toBeGreaterThanOrEqual(10);
  });
});
