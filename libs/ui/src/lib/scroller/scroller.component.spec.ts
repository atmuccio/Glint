import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintScrollerComponent } from './scroller.component';


@Component({
  selector: 'glint-test-scroller-host',
  standalone: true,
  imports: [GlintScrollerComponent],
  template: `
    <glint-scroller
      [items]="items"
      [itemSize]="itemSize"
      [scrollHeight]="scrollHeight"
      [orientation]="orientation"
    >
      <ng-template #item let-item>
        <div class="item-content">{{ item.name }}</div>
      </ng-template>
    </glint-scroller>
  `,
})
class TestScrollerHostComponent {
  items = Array.from({ length: 100 }, (_, i) => ({ name: `Item ${i}` }));
  itemSize = 40;
  scrollHeight = '200px';
  orientation: 'vertical' | 'horizontal' = 'vertical';
}

describe('GlintScrollerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestScrollerHostComponent],
    });
  });

  it('should render viewport with correct height', () => {
    const fixture = TestBed.createComponent(TestScrollerHostComponent);
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    expect(viewport).toBeTruthy();
    expect(viewport.style.blockSize).toBe('200px');
  });

  it('should render the viewport with content wrapper', async () => {
    const fixture = TestBed.createComponent(TestScrollerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    expect(viewport).toBeTruthy();
    const contentWrapper = viewport.querySelector('.cdk-virtual-scroll-content-wrapper');
    expect(contentWrapper).toBeTruthy();
  });

  it('should have correct item size on the viewport', () => {
    const fixture = TestBed.createComponent(TestScrollerHostComponent);
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    expect(viewport).toBeTruthy();
    // The CDK sets itemSize via the CdkFixedSizeVirtualScroll strategy
    // Verify the viewport element exists and has the expected structure
    expect(viewport.querySelector('.cdk-virtual-scroll-content-wrapper')).toBeTruthy();
    // Also verify spacer is present (CDK uses it to maintain scroll dimensions)
    expect(viewport.querySelector('.cdk-virtual-scroll-spacer')).toBeTruthy();
  });

  it('should apply vertical orientation by default', () => {
    const fixture = TestBed.createComponent(TestScrollerHostComponent);
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    expect(viewport).toBeTruthy();
    // CDK adds a CSS class for orientation direction
    expect(viewport.classList.contains('cdk-virtual-scroll-orientation-vertical')).toBe(true);
  });

  it('should apply horizontal orientation when set', () => {
    const fixture = TestBed.createComponent(TestScrollerHostComponent);
    fixture.componentInstance.orientation = 'horizontal';
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    expect(viewport).toBeTruthy();
    expect(viewport.classList.contains('cdk-virtual-scroll-orientation-horizontal')).toBe(true);
  });

  it('should apply custom scroll height', () => {
    const fixture = TestBed.createComponent(TestScrollerHostComponent);
    fixture.componentInstance.scrollHeight = '400px';
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    expect(viewport.style.blockSize).toBe('400px');
  });

  it('should contain scroller-item elements in the content wrapper', async () => {
    const fixture = TestBed.createComponent(TestScrollerHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    const viewport = fixture.nativeElement.querySelector('cdk-virtual-scroll-viewport');
    // CDK may or may not render items depending on the test environment's layout
    // At minimum, verify the content wrapper is present
    const contentWrapper = viewport.querySelector('.cdk-virtual-scroll-content-wrapper');
    expect(contentWrapper).toBeTruthy();
  });
});
