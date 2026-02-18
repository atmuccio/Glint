import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintToggleButtonComponent } from './toggle-button.component';

@Component({
  selector: 'glint-test-toggle-btn-host',
  standalone: true,
  imports: [GlintToggleButtonComponent, ReactiveFormsModule],
  template: `
    <glint-toggle-button
      [formControl]="ctrl"
      [disabled]="disabled"
      [onLabel]="onLabel"
      [offLabel]="offLabel"
    />
  `,
})
class TestToggleButtonHostComponent {
  ctrl = new FormControl(false);
  disabled = false;
  onLabel = '';
  offLabel = '';
}

describe('GlintToggleButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestToggleButtonHostComponent],
    });
  });

  it('should render with default state (unpressed)', () => {
    const fixture = TestBed.createComponent(TestToggleButtonHostComponent);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-toggle-button') as HTMLElement;
    expect(host.classList.contains('pressed')).toBe(false);

    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    expect(button.getAttribute('aria-pressed')).toBe('false');
  });

  it('should toggle on click', () => {
    const fixture = TestBed.createComponent(TestToggleButtonHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(true);
    const host = fixture.nativeElement.querySelector('glint-toggle-button') as HTMLElement;
    expect(host.classList.contains('pressed')).toBe(true);
  });

  it('should not toggle when disabled', () => {
    const fixture = TestBed.createComponent(TestToggleButtonHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(false);
    const host = fixture.nativeElement.querySelector('glint-toggle-button') as HTMLElement;
    expect(host.classList.contains('pressed')).toBe(false);
  });

  it('should set aria-pressed attribute', () => {
    const fixture = TestBed.createComponent(TestToggleButtonHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    expect(button.getAttribute('aria-pressed')).toBe('false');

    button.click();
    fixture.detectChanges();
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });

  it('should work with FormControl (CVA integration)', () => {
    const fixture = TestBed.createComponent(TestToggleButtonHostComponent);
    fixture.detectChanges();

    // Set value via FormControl
    fixture.componentInstance.ctrl.setValue(true);
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-toggle-button') as HTMLElement;
    expect(host.classList.contains('pressed')).toBe(true);

    // Toggle via click should update FormControl
    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(false);
    expect(host.classList.contains('pressed')).toBe(false);
  });

  it('should disable via FormControl', () => {
    const fixture = TestBed.createComponent(TestToggleButtonHostComponent);
    fixture.detectChanges();

    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-toggle-button') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);

    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it('should display labels based on pressed state', () => {
    const fixture = TestBed.createComponent(TestToggleButtonHostComponent);
    fixture.componentInstance.onLabel = 'ON';
    fixture.componentInstance.offLabel = 'OFF';
    fixture.detectChanges();

    const label = fixture.nativeElement.querySelector('.label') as HTMLElement;
    expect(label.textContent).toBe('OFF');

    const button = fixture.nativeElement.querySelector('.toggle-btn') as HTMLButtonElement;
    button.click();
    fixture.detectChanges();

    const updatedLabel = fixture.nativeElement.querySelector('.label') as HTMLElement;
    expect(updatedLabel.textContent).toBe('ON');
  });
});
