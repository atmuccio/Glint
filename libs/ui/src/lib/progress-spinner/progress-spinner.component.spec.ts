import { TestBed } from '@angular/core/testing';
import { GlintProgressSpinnerComponent } from './progress-spinner.component';

describe('GlintProgressSpinnerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [GlintProgressSpinnerComponent] });
  });

  it('should have status role', () => {
    const fixture = TestBed.createComponent(GlintProgressSpinnerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('role')).toBe('status');
  });

  it('should render SVG circle', () => {
    const fixture = TestBed.createComponent(GlintProgressSpinnerComponent);
    fixture.detectChanges();
    const circle = fixture.nativeElement.querySelector('circle');
    expect(circle).toBeTruthy();
  });

  it('should apply default size', () => {
    const fixture = TestBed.createComponent(GlintProgressSpinnerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.style.inlineSize).toBe('2.5rem');
  });

  it('should have aria-label for accessibility', () => {
    const fixture = TestBed.createComponent(GlintProgressSpinnerComponent);
    fixture.detectChanges();
    expect(fixture.nativeElement.getAttribute('aria-label')).toBe('Loading');
  });

  it('should apply custom size via input', () => {
    const fixture = TestBed.createComponent(GlintProgressSpinnerComponent);
    fixture.componentRef.setInput('size', '4rem');
    fixture.detectChanges();
    expect(fixture.nativeElement.style.inlineSize).toBe('4rem');
    expect(fixture.nativeElement.style.blockSize).toBe('4rem');
  });
});
