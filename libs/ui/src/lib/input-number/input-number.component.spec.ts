import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintInputNumberComponent } from './input-number.component';

@Component({
  selector: 'glint-test-input-number-host',
  standalone: true,
  imports: [GlintInputNumberComponent, ReactiveFormsModule],
  template: `
    <glint-input-number
      [label]="label"
      [min]="min"
      [max]="max"
      [step]="step"
      [formControl]="ctrl"
    />
  `,
})
class TestInputNumberHostComponent {
  ctrl = new FormControl<number | null>(5);
  label = 'Quantity';
  min: number | null = null;
  max: number | null = null;
  step = 1;
}

describe('GlintInputNumberComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestInputNumberHostComponent] });
  });

  it('should render label', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.label') as HTMLElement;
    expect(label.textContent?.trim()).toBe('Quantity');
  });

  it('should display initial FormControl value', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.value).toBe('5');
  });

  it('should increment on spinner click', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.spinner-btn') as NodeListOf<HTMLButtonElement>;
    buttons[0].dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(6);
  });

  it('should decrement on spinner click', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.spinner-btn') as NodeListOf<HTMLButtonElement>;
    buttons[1].dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(4);
  });

  it('should respect max bound', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.componentInstance.max = 5;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.spinner-btn') as NodeListOf<HTMLButtonElement>;
    buttons[0].dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(5);
  });

  it('should respect min bound', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.componentInstance.ctrl.setValue(0);
    fixture.componentInstance.min = 0;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.spinner-btn') as NodeListOf<HTMLButtonElement>;
    buttons[1].dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(0);
  });

  it('should increment on ArrowUp keydown', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(6);
  });

  it('should have spinbutton role', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('role')).toBe('spinbutton');
  });

  it('should use custom step', () => {
    const fixture = TestBed.createComponent(TestInputNumberHostComponent);
    fixture.componentInstance.step = 0.5;
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.spinner-btn') as NodeListOf<HTMLButtonElement>;
    buttons[0].dispatchEvent(new MouseEvent('mousedown'));
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe(5.5);
  });
});
