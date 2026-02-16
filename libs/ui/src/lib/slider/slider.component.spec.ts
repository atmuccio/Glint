import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintSliderComponent } from './slider.component';

@Component({
  selector: 'glint-test-slider-host',
  standalone: true,
  imports: [GlintSliderComponent, ReactiveFormsModule],
  template: `
    <glint-slider [min]="0" [max]="100" [step]="5" [formControl]="ctrl" [showLabels]="true" />
  `,
})
class TestSliderHostComponent {
  ctrl = new FormControl(50);
}

describe('GlintSliderComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestSliderHostComponent] });
  });

  it('should render range input', () => {
    const fixture = TestBed.createComponent(TestSliderHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]');
    expect(input).toBeTruthy();
  });

  it('should display initial value from FormControl', () => {
    const fixture = TestBed.createComponent(TestSliderHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    expect(input.value).toBe('50');
  });

  it('should update FormControl on input', () => {
    const fixture = TestBed.createComponent(TestSliderHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]') as HTMLInputElement;
    input.value = '75';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(75);
  });

  it('should show labels', () => {
    const fixture = TestBed.createComponent(TestSliderHostComponent);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelector('.labels');
    expect(labels).toBeTruthy();
    expect(labels.textContent).toContain('50');
  });

  it('should set aria attributes', () => {
    const fixture = TestBed.createComponent(TestSliderHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input[type="range"]');
    expect(input.getAttribute('aria-valuemin')).toBe('0');
    expect(input.getAttribute('aria-valuemax')).toBe('100');
    expect(input.getAttribute('aria-valuenow')).toBe('50');
  });
});
