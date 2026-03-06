import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintPasswordComponent } from './password.component';

@Component({
  selector: 'glint-test-password-host',
  standalone: true,
  imports: [GlintPasswordComponent, ReactiveFormsModule],
  template: `
    <glint-password label="Password" [formControl]="ctrl" [showStrength]="showStrength" />
  `,
})
class TestPasswordHostComponent {
  ctrl = new FormControl('');
  showStrength = false;
}

@Component({
  selector: 'glint-test-password-validation-host',
  standalone: true,
  imports: [GlintPasswordComponent, ReactiveFormsModule],
  template: `
    <glint-password
      label="Password"
      [formControl]="ctrl"
      [invalid]="invalid()"
      [errorMessage]="errorMessage()"
      [autocomplete]="autocomplete()"
    />
  `,
})
class TestPasswordValidationHostComponent {
  ctrl = new FormControl('');
  invalid = signal(false);
  errorMessage = signal('');
  autocomplete = signal('');
}

describe('GlintPasswordComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestPasswordHostComponent, TestPasswordValidationHostComponent],
    });
  });

  it('should render label', () => {
    const fixture = TestBed.createComponent(TestPasswordHostComponent);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.label');
    expect(label.textContent?.trim()).toBe('Password');
  });

  it('should default to password type', () => {
    const fixture = TestBed.createComponent(TestPasswordHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('password');
  });

  it('should toggle visibility on button click', () => {
    const fixture = TestBed.createComponent(TestPasswordHostComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.toggle') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.type).toBe('text');
  });

  it('should sync with FormControl', () => {
    const fixture = TestBed.createComponent(TestPasswordHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'secret123';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe('secret123');
  });

  it('should show strength meter when enabled', () => {
    const fixture = TestBed.createComponent(TestPasswordHostComponent);
    fixture.componentInstance.showStrength = true;
    fixture.componentInstance.ctrl.setValue('Abc123!@');
    fixture.detectChanges();
    const meter = fixture.nativeElement.querySelector('.strength-meter');
    expect(meter).toBeTruthy();
  });

  it('should show error message with role="alert" when invalid', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.componentInstance.invalid.set(true);
    fixture.componentInstance.errorMessage.set('Password is required');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.error') as HTMLElement;
    expect(error).toBeTruthy();
    expect(error.textContent?.trim()).toBe('Password is required');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('should hide error message when valid', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.componentInstance.invalid.set(false);
    fixture.componentInstance.errorMessage.set('Password is required');
    fixture.detectChanges();

    const error = fixture.nativeElement.querySelector('.error');
    expect(error).toBeFalsy();
  });

  it('should set aria-invalid on inner input when invalid', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should not set aria-invalid when valid', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.componentInstance.invalid.set(false);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBeNull();
  });

  it('should add invalid class to host element', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.componentInstance.invalid.set(true);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-password') as HTMLElement;
    expect(host.classList.contains('invalid')).toBe(true);
  });

  it('should set aria-describedby linking to error message', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.componentInstance.invalid.set(true);
    fixture.componentInstance.errorMessage.set('Too short');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const error = fixture.nativeElement.querySelector('.error') as HTMLElement;
    expect(input.getAttribute('aria-describedby')).toBe(error.id);
  });

  it('should forward autocomplete attribute to inner input', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.componentInstance.autocomplete.set('new-password');
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('autocomplete')).toBe('new-password');
  });

  it('should not set autocomplete when empty', () => {
    const fixture = TestBed.createComponent(TestPasswordValidationHostComponent);
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('autocomplete')).toBeNull();
  });
});
