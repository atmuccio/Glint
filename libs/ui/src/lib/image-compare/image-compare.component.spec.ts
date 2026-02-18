import { TestBed } from '@angular/core/testing';
import { Component, viewChild } from '@angular/core';
import { GlintImageCompareComponent } from './image-compare.component';

@Component({
  selector: 'glint-test-compare-host',
  standalone: true,
  imports: [GlintImageCompareComponent],
  template: `
    <glint-image-compare
      #cmp
      leftSrc="https://example.com/before.jpg"
      rightSrc="https://example.com/after.jpg"
      [leftAlt]="leftAlt"
      [rightAlt]="rightAlt"
      [initialPosition]="initialPosition"
    />
  `,
})
class TestCompareHostComponent {
  cmp = viewChild.required<GlintImageCompareComponent>('cmp');
  leftAlt = 'Before';
  rightAlt = 'After';
  initialPosition = 50;
}

describe('GlintImageCompareComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestCompareHostComponent] });
  });

  it('should render both images', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.detectChanges();
    const images = fixture.nativeElement.querySelectorAll('img');
    expect(images.length).toBe(2);
    expect(images[0].src).toContain('after.jpg');
    expect(images[1].src).toContain('before.jpg');
  });

  it('should set initial position', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.componentInstance.initialPosition = 30;
    fixture.detectChanges();
    const handle = fixture.nativeElement.querySelector('.compare-handle') as HTMLElement;
    expect(handle.style.insetInlineStart).toBe('30%');
  });

  it('should have slider role with aria attributes', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.detectChanges();
    const handle = fixture.nativeElement.querySelector('[role="slider"]') as HTMLElement;
    expect(handle).toBeTruthy();
    expect(handle.getAttribute('aria-valuenow')).toBe('50');
    expect(handle.getAttribute('aria-valuemin')).toBe('0');
    expect(handle.getAttribute('aria-valuemax')).toBe('100');
    expect(handle.getAttribute('aria-label')).toBe('Image comparison slider');
  });

  it('should update position on keyboard ArrowLeft', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.detectChanges();
    const handle = fixture.nativeElement.querySelector('[role="slider"]') as HTMLElement;
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(handle.getAttribute('aria-valuenow')).toBe('49');
    expect(handle.style.insetInlineStart).toBe('49%');
  });

  it('should update position on keyboard ArrowRight', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.detectChanges();
    const handle = fixture.nativeElement.querySelector('[role="slider"]') as HTMLElement;
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    fixture.detectChanges();
    expect(handle.getAttribute('aria-valuenow')).toBe('51');
    expect(handle.style.insetInlineStart).toBe('51%');
  });

  it('should render handle at correct position', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.componentInstance.initialPosition = 75;
    fixture.detectChanges();
    const handle = fixture.nativeElement.querySelector('.compare-handle') as HTMLElement;
    expect(handle.style.insetInlineStart).toBe('75%');
  });

  it('should clamp position at boundaries', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.componentInstance.initialPosition = 0;
    fixture.detectChanges();
    const handle = fixture.nativeElement.querySelector('[role="slider"]') as HTMLElement;
    // Try to go below 0
    handle.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
    fixture.detectChanges();
    expect(handle.getAttribute('aria-valuenow')).toBe('0');
  });

  it('should apply clip-path to left image', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.detectChanges();
    const leftImg = fixture.nativeElement.querySelector('.compare-image.left') as HTMLImageElement;
    expect(leftImg.style.clipPath).toBe('inset(0 50% 0 0)');
  });

  it('should use custom alt text', () => {
    const fixture = TestBed.createComponent(TestCompareHostComponent);
    fixture.componentInstance.leftAlt = 'Original';
    fixture.componentInstance.rightAlt = 'Edited';
    fixture.detectChanges();
    const images = fixture.nativeElement.querySelectorAll('img');
    expect(images[0].alt).toBe('Edited');
    expect(images[1].alt).toBe('Original');
  });
});
