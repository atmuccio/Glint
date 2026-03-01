import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintStepperComponent } from './stepper.component';
import { GlintStepComponent } from './step.component';
import { provideGlintTestIcons } from '../testing/test-utils';

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

@Component({
  selector: 'glint-test-stepper-error-host',
  standalone: true,
  imports: [GlintStepperComponent, GlintStepComponent],
  template: `
    <glint-stepper [(activeStep)]="step">
      <glint-step label="Account" [hasError]="hasAccountError" [completed]="true">Account form</glint-step>
      <glint-step label="Profile">Profile form</glint-step>
      <glint-step label="Review">Review page</glint-step>
    </glint-stepper>
  `,
})
class TestStepperErrorHostComponent {
  step = signal(1);
  hasAccountError = true;
}

describe('GlintStepperComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestStepperHostComponent, TestStepperErrorHostComponent],
      providers: [provideGlintTestIcons()],
    });
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

  // --- Non-linear navigation ---

  it('should allow clicking any step in non-linear mode (default)', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    // Click directly to step 3 (index 2) without going through step 2
    headers[2].click();
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.step-content');
    expect(content.textContent?.trim()).toBe('Review page');
  });

  it('should allow navigating back to completed steps', () => {
    const fixture = TestBed.createComponent(TestStepperHostComponent);
    fixture.componentInstance.step.set(2);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    // Click back to step 1
    headers[0].click();
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.step-content');
    expect(content.textContent?.trim()).toBe('Account form');
  });

  // --- Error state ---

  it('should apply error class on step header when hasError is true', () => {
    const fixture = TestBed.createComponent(TestStepperErrorHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    expect(headers[0].classList.contains('error')).toBe(true);
    expect(headers[1].classList.contains('error')).toBe(false);
  });

  it('should render warning icon instead of checkmark when hasError', () => {
    const fixture = TestBed.createComponent(TestStepperErrorHostComponent);
    fixture.detectChanges();
    const stepNumber = fixture.nativeElement.querySelector('glint-step-header .step-number');
    const icon = stepNumber.querySelector('glint-icon');
    expect(icon).toBeTruthy();
    expect(icon.getAttribute('name')).toBe('triangleAlert');
  });

  it('should not apply complete class when hasError overrides completed', () => {
    const fixture = TestBed.createComponent(TestStepperErrorHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('glint-step-header');
    // Step 0 has both completed=true and hasError=true — error takes precedence
    expect(headers[0].classList.contains('complete')).toBe(false);
    expect(headers[0].classList.contains('error')).toBe(true);
  });
});
