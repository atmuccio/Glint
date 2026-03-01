import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintScrollTopComponent } from './scroll-top.component';

@Component({
  selector: 'glint-test-scroll-top-host',
  standalone: true,
  imports: [GlintScrollTopComponent],
  template: `<glint-scroll-top />`,
})
class TestScrollTopHostComponent {}

describe('GlintScrollTopComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestScrollTopHostComponent] });
  });

  it('should not be visible initially', () => {
    const fixture = TestBed.createComponent(TestScrollTopHostComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.scroll-top-btn');
    expect(btn).toBeNull();
  });

  it('should render a button when visible signal is true', () => {
    const fixture = TestBed.createComponent(GlintScrollTopComponent);
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.scroll-top-btn') as HTMLButtonElement;
    expect(btn).toBeTruthy();
  });

  it('should have aria-label "Scroll to top"', () => {
    const fixture = TestBed.createComponent(GlintScrollTopComponent);
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.scroll-top-btn') as HTMLButtonElement;
    expect(btn.getAttribute('aria-label')).toBe('Scroll to top');
  });

  it('should have button type', () => {
    const fixture = TestBed.createComponent(GlintScrollTopComponent);
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.scroll-top-btn') as HTMLButtonElement;
    expect(btn.type).toBe('button');
  });

  it('should call scrollToTop on click', () => {
    const fixture = TestBed.createComponent(GlintScrollTopComponent);
    const spy = vi.spyOn(fixture.componentInstance, 'scrollToTop');
    fixture.componentInstance.visible.set(true);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.scroll-top-btn') as HTMLButtonElement;
    btn.click();
    expect(spy).toHaveBeenCalled();
  });
});
