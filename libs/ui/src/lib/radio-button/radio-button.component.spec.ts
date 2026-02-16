import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintRadioButtonComponent } from './radio-button.component';
import { GlintStyleZoneComponent } from '../core/style-zone/style-zone.component';

@Component({
  selector: 'glint-test-radio-host',
  standalone: true,
  imports: [GlintRadioButtonComponent, GlintStyleZoneComponent, ReactiveFormsModule],
  template: `
    <glint-style-zone>
      <glint-radio-button [value]="'a'" [formControl]="ctrl" name="group1">Alpha</glint-radio-button>
      <glint-radio-button [value]="'b'" [formControl]="ctrl" name="group1">Beta</glint-radio-button>
    </glint-style-zone>
  `,
})
class TestRadioHostComponent {
  ctrl = new FormControl('a');
}

describe('GlintRadioButtonComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestRadioHostComponent],
    });
  });

  it('should render with first option checked', async () => {
    const fixture = TestBed.createComponent(TestRadioHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const radios = fixture.nativeElement.querySelectorAll('glint-radio-button') as NodeListOf<HTMLElement>;
    expect(radios[0].classList.contains('checked')).toBe(true);
    expect(radios[1].classList.contains('checked')).toBe(false);
  });

  it('should select second option on click', async () => {
    const fixture = TestBed.createComponent(TestRadioHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const boxes = fixture.nativeElement.querySelectorAll('.radio') as NodeListOf<HTMLElement>;
    boxes[1].click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe('b');
    const radios = fixture.nativeElement.querySelectorAll('glint-radio-button') as NodeListOf<HTMLElement>;
    expect(radios[1].classList.contains('checked')).toBe(true);
  });

  it('should reflect FormControl value change', async () => {
    const fixture = TestBed.createComponent(TestRadioHostComponent);
    fixture.componentInstance.ctrl.setValue('b');
    fixture.detectChanges();
    await fixture.whenStable();

    const radios = fixture.nativeElement.querySelectorAll('glint-radio-button') as NodeListOf<HTMLElement>;
    expect(radios[0].classList.contains('checked')).toBe(false);
    expect(radios[1].classList.contains('checked')).toBe(true);
  });

  it('should render label content', async () => {
    const fixture = TestBed.createComponent(TestRadioHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const labels = fixture.nativeElement.querySelectorAll('label');
    expect(labels[0].textContent).toContain('Alpha');
    expect(labels[1].textContent).toContain('Beta');
  });

  it('should have correct ARIA attributes', async () => {
    const fixture = TestBed.createComponent(TestRadioHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const boxes = fixture.nativeElement.querySelectorAll('.radio') as NodeListOf<HTMLElement>;
    expect(boxes[0].getAttribute('role')).toBe('radio');
    expect(boxes[0].getAttribute('aria-checked')).toBe('true');
    expect(boxes[1].getAttribute('aria-checked')).toBe('false');
  });
});
