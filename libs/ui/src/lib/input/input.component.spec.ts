import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintInputComponent } from './input.component';

/** Host with FormControl — no [disabled] binding (use ctrl.disable() instead) */
@Component({
  selector: 'glint-test-input-form-host',
  standalone: true,
  imports: [GlintInputComponent, ReactiveFormsModule],
  template: `
    <glint-input
      [label]="label"
      [placeholder]="placeholder"
      [variant]="variant"
      [invalid]="invalid"
      [errorMessage]="errorMessage"
      [autocomplete]="autocomplete"
      [formControl]="ctrl"
    />
  `,
})
class TestInputFormHostComponent {
  ctrl = new FormControl('');
  label = 'Test Label';
  placeholder = 'Enter text';
  variant: 'outline' | 'filled' | 'underline' = 'outline';
  invalid = false;
  errorMessage = '';
  autocomplete = '';
}

/** Host without FormControl — for testing [disabled] input prop */
@Component({
  selector: 'glint-test-input-standalone-host',
  standalone: true,
  imports: [GlintInputComponent],
  template: `
    <glint-input
      [label]="label"
      [disabled]="disabled"
    />
  `,
})
class TestInputStandaloneHostComponent {
  label = 'Standalone';
  disabled = false;
}

describe('GlintInputComponent', () => {
  it('should render label', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('.label') as HTMLElement;
    expect(label).toBeTruthy();
    expect(label.textContent?.trim()).toBe('Test Label');
  });

  it('should render with outline variant by default', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-input') as HTMLElement;
    expect(host.getAttribute('data-variant')).toBe('outline');
  });

  it('should show all three variants', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    for (const variant of ['outline', 'filled', 'underline'] as const) {
      const fixture = TestBed.createComponent(TestInputFormHostComponent);
      fixture.componentInstance.variant = variant;
      fixture.detectChanges();
      await fixture.whenStable();

      const host = fixture.nativeElement.querySelector('glint-input') as HTMLElement;
      expect(host.getAttribute('data-variant')).toBe(variant);
    }
  });

  it('should work with FormControl (CVA write)', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.componentInstance.ctrl.setValue('hello');
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('hello');
  });

  it('should propagate input changes back to FormControl', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.value = 'typed';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe('typed');
  });

  it('should show error message when invalid', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.componentInstance.invalid = true;
    fixture.componentInstance.errorMessage = 'Required field';
    fixture.detectChanges();
    await fixture.whenStable();

    const error = fixture.nativeElement.querySelector('.error') as HTMLElement;
    expect(error).toBeTruthy();
    expect(error.textContent?.trim()).toBe('Required field');
    expect(error.getAttribute('role')).toBe('alert');
  });

  it('should set aria-invalid when invalid', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.componentInstance.invalid = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });

  it('should set disabled state from FormControl', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-input') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(host.classList.contains('disabled')).toBe(true);
    expect(input.disabled).toBe(true);
  });

  it('should set disabled state from input property (no FormControl)', async () => {
    TestBed.configureTestingModule({ imports: [TestInputStandaloneHostComponent] });
    const fixture = TestBed.createComponent(TestInputStandaloneHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-input') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });

  it('should link label to input via for/id', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('.label') as HTMLLabelElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(label.getAttribute('for')).toBe(input.id);
  });

  it('should track focus state', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-input') as HTMLElement;
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    expect(host.classList.contains('focused')).toBe(true);

    input.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    expect(host.classList.contains('focused')).toBe(false);
  });

  it('should forward autocomplete attribute to inner input', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.componentInstance.autocomplete = 'email';
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('autocomplete')).toBe('email');
  });

  it('should not set autocomplete when empty', async () => {
    TestBed.configureTestingModule({ imports: [TestInputFormHostComponent] });
    const fixture = TestBed.createComponent(TestInputFormHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('autocomplete')).toBeNull();
  });
});
