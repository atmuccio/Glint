import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintSelectButtonComponent, SelectButtonOption } from './select-button.component';

const TEST_OPTIONS: SelectButtonOption[] = [
  { label: 'Left', value: 'left' },
  { label: 'Center', value: 'center' },
  { label: 'Right', value: 'right' },
];

@Component({
  selector: 'glint-test-select-button-host',
  standalone: true,
  imports: [GlintSelectButtonComponent, ReactiveFormsModule],
  template: `
    <glint-select-button
      [options]="options"
      [multiple]="multiple"
      [disabled]="disabled"
      [formControl]="ctrl"
    />
  `,
})
class TestSelectButtonHostComponent {
  options: SelectButtonOption[] = TEST_OPTIONS;
  multiple = false;
  disabled = false;
  ctrl = new FormControl<unknown>(null);
}

describe('GlintSelectButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestSelectButtonHostComponent],
    });
  });

  it('should render options as buttons', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.select-btn');
    expect(buttons.length).toBe(3);
    expect(buttons[0].textContent.trim()).toBe('Left');
    expect(buttons[1].textContent.trim()).toBe('Center');
    expect(buttons[2].textContent.trim()).toBe('Right');
  });

  it('should select single option on click', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.select-btn');
    buttons[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe('center');
    expect(buttons[1].classList.contains('selected')).toBe(true);
    expect(buttons[1].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].classList.contains('selected')).toBe(false);
  });

  it('should select multiple options when multiple is true', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.select-btn');
    buttons[0].click();
    fixture.detectChanges();
    buttons[2].click();
    fixture.detectChanges();

    const value = fixture.componentInstance.ctrl.value as unknown[];
    expect(value).toContain('left');
    expect(value).toContain('right');
    expect(buttons[0].classList.contains('selected')).toBe(true);
    expect(buttons[2].classList.contains('selected')).toBe(true);
  });

  it('should deselect on second click in multiple mode', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.select-btn');
    buttons[0].click();
    fixture.detectChanges();
    expect((fixture.componentInstance.ctrl.value as unknown[]).length).toBe(1);

    buttons[0].click();
    fixture.detectChanges();
    expect((fixture.componentInstance.ctrl.value as unknown[]).length).toBe(0);
    expect(buttons[0].classList.contains('selected')).toBe(false);
  });

  it('should not select disabled option', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.componentInstance.options = [
      { label: 'A', value: 'a' },
      { label: 'B', value: 'b', disabled: true },
      { label: 'C', value: 'c' },
    ];
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.select-btn');
    expect(buttons[1].disabled).toBe(true);

    buttons[1].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBeNull();
  });

  it('should work with FormControl (CVA)', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.componentInstance.ctrl.setValue('right');
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.select-btn');
    expect(buttons[2].classList.contains('selected')).toBe(true);
    expect(buttons[2].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].classList.contains('selected')).toBe(false);
    expect(buttons[1].classList.contains('selected')).toBe(false);
  });

  it('should apply global disabled state', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-select-button') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });

  it('should replace selection in single mode', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('.select-btn');
    buttons[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe('left');

    buttons[2].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.ctrl.value).toBe('right');
    expect(buttons[0].classList.contains('selected')).toBe(false);
    expect(buttons[2].classList.contains('selected')).toBe(true);
  });

  it('should disable via FormControl', () => {
    const fixture = TestBed.createComponent(TestSelectButtonHostComponent);
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-select-button') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });
});
