import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
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

describe('GlintPasswordComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestPasswordHostComponent] });
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
});
