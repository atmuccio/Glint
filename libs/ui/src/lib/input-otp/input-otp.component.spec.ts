import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintInputOtpComponent } from './input-otp.component';

@Component({
  selector: 'glint-test-otp-host',
  standalone: true,
  imports: [GlintInputOtpComponent, ReactiveFormsModule],
  template: `
    <glint-input-otp
      [length]="length"
      [integerOnly]="integerOnly"
      [mask]="mask"
      [formControl]="ctrl"
      (complete)="completedValue = $event"
    />
  `,
})
class TestOtpHostComponent {
  ctrl = new FormControl('');
  length = 4;
  integerOnly = false;
  mask = false;
  completedValue = '';
}

@Component({
  selector: 'glint-test-otp-disabled-host',
  standalone: true,
  imports: [GlintInputOtpComponent],
  template: `
    <glint-input-otp [length]="4" [disabled]="disabled" />
  `,
})
class TestOtpDisabledHostComponent {
  disabled = false;
}

describe('GlintInputOtpComponent', () => {
  it('should render correct number of inputs', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpHostComponent] });
    const fixture = TestBed.createComponent(TestOtpHostComponent);
    fixture.componentInstance.length = 6;
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;
    expect(inputs.length).toBe(6);
  });

  it('should auto-advance to next input on character entry', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpHostComponent] });
    const fixture = TestBed.createComponent(TestOtpHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;

    // Focus first input and type a character
    inputs[0].focus();
    inputs[0].value = '1';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    // After microtask, focus should move to next input
    await new Promise(resolve => setTimeout(resolve, 0));
    expect(document.activeElement).toBe(inputs[1]);
  });

  it('should auto-focus previous input on backspace', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpHostComponent] });
    const fixture = TestBed.createComponent(TestOtpHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;

    // Focus second input (empty) and press Backspace
    inputs[1].focus();
    inputs[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    await new Promise(resolve => setTimeout(resolve, 0));
    expect(document.activeElement).toBe(inputs[0]);
  });

  it('should concatenate values for CVA', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpHostComponent] });
    const fixture = TestBed.createComponent(TestOtpHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;

    // Type characters into first two inputs
    inputs[0].focus();
    inputs[0].value = 'A';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();

    inputs[1].focus();
    inputs[1].value = 'B';
    inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('AB');
  });

  it('should emit complete when all inputs filled', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpHostComponent] });
    const fixture = TestBed.createComponent(TestOtpHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;

    // Fill all 4 inputs
    for (let i = 0; i < 4; i++) {
      inputs[i].focus();
      inputs[i].value = String(i + 1);
      inputs[i].dispatchEvent(new Event('input', { bubbles: true }));
      fixture.detectChanges();
    }
    await fixture.whenStable();

    expect(fixture.componentInstance.completedValue).toBe('1234');
  });

  it('should restrict to digits when integerOnly is true', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpHostComponent] });
    const fixture = TestBed.createComponent(TestOtpHostComponent);
    fixture.componentInstance.integerOnly = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;

    // Try typing a letter
    inputs[0].focus();
    inputs[0].value = 'a';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    // Should reject the letter
    expect(inputs[0].value).toBe('');
    expect(fixture.componentInstance.ctrl.value).toBe('');

    // Type a digit — should be accepted
    inputs[0].value = '5';
    inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(fixture.componentInstance.ctrl.value).toBe('5');
  });

  it('should work with FormControl (CVA)', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpHostComponent] });
    const fixture = TestBed.createComponent(TestOtpHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    // Set value via FormControl
    fixture.componentInstance.ctrl.setValue('ABCD');
    fixture.detectChanges();
    await fixture.whenStable();

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;
    expect(inputs[0].value).toBe('A');
    expect(inputs[1].value).toBe('B');
    expect(inputs[2].value).toBe('C');
    expect(inputs[3].value).toBe('D');
  });

  it('should not accept input when disabled', async () => {
    TestBed.configureTestingModule({ imports: [TestOtpDisabledHostComponent] });
    const fixture = TestBed.createComponent(TestOtpDisabledHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-input-otp') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);

    const inputs = fixture.nativeElement.querySelectorAll('.otp-input') as NodeListOf<HTMLInputElement>;
    expect(inputs[0].disabled).toBe(true);
  });
});
