import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintSkeletonComponent } from './skeleton.component';

@Component({
  selector: 'glint-test-skeleton-host',
  standalone: true,
  imports: [GlintSkeletonComponent],
  template: `<glint-skeleton [shape]="shape" [width]="width" [height]="height" [size]="size" />`,
})
class TestSkeletonHostComponent {
  shape: 'rectangle' | 'rounded' | 'circle' = 'rectangle';
  width = '200px';
  height = '1.5rem';
  size = '3rem';
}

describe('GlintSkeletonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestSkeletonHostComponent] });
  });

  it('should render with rectangle shape by default', () => {
    const fixture = TestBed.createComponent(TestSkeletonHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-skeleton') as HTMLElement;
    expect(el.getAttribute('data-shape')).toBe('rectangle');
  });

  it('should apply width and height for rectangle', () => {
    const fixture = TestBed.createComponent(TestSkeletonHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-skeleton') as HTMLElement;
    expect(el.style.inlineSize).toBe('200px');
    expect(el.style.blockSize).toBe('1.5rem');
  });

  it('should use size for circle shape', () => {
    const fixture = TestBed.createComponent(TestSkeletonHostComponent);
    fixture.componentInstance.shape = 'circle';
    fixture.componentInstance.size = '4rem';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-skeleton') as HTMLElement;
    expect(el.style.inlineSize).toBe('4rem');
    expect(el.style.blockSize).toBe('4rem');
  });

  it('should apply rounded shape', () => {
    const fixture = TestBed.createComponent(TestSkeletonHostComponent);
    fixture.componentInstance.shape = 'rounded';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-skeleton') as HTMLElement;
    expect(el.getAttribute('data-shape')).toBe('rounded');
  });
});
