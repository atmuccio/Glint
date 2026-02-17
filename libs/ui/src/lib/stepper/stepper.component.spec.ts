import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintStepperComponent } from './stepper.component';
import { GlintStepComponent } from './step.component';

@Component({
  selector: 'glint-test-stepper-host',
  standalone: true,
  imports: [GlintStepperComponent, GlintStepComponent],
  template: `
    <glint-stepper [(activeStep)]="step">
      <glint-step label="Account">Account form</glint-step>
      <glint-step label="Profile">Profile form</glint-step>
      <glint-step label="Review">Review page</glint-step>
    </glint-stepper>
  `,
})
class TestStepperHostComponent {
  step = signal(0);
}

describe('GlintStepperComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestStepperHostComponent] });
  });

  it('should render step headers', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Account');
  });

  it('should show first step content by default', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.step-content');
    expect(content.textContent?.trim()).toBe('Account form');
  });

  it('should switch step on header click', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    headers[1].click();
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.step-content');
    expect(content.textContent?.trim()).toBe('Profile form');
  });

  it('should mark active step', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    expect(headers[0].classList.contains('active')).toBe(true);
  });

  it('should mark completed steps', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.componentInstance.step.set(2);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    expect(headers[0].classList.contains('complete')).toBe(true);
    expect(headers[1].classList.contains('complete')).toBe(true);
  });

  it('should render connectors between steps', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const connectors = fixture.nativeElement.querySelectorAll('.connector');
    expect(connectors.length).toBe(2);
  });

  it('should support next() and previous() navigation', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const stepper = fixture.debugElement.children[0].componentInstance as GlintStepperComponent;

    stepper.next();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.step-content').textContent?.trim()).toBe('Profile form');

    stepper.previous();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.step-content').textContent?.trim()).toBe('Account form');
  });

  it('should support prev() as alias for previous()', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const stepper = fixture.debugElement.children[0].componentInstance as GlintStepperComponent;

    stepper.next();
    fixture.detectChanges();
    stepper.prev();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.step-content').textContent?.trim()).toBe('Account form');
  });
});
