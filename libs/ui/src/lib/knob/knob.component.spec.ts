import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintKnobComponent } from './knob.component';

@Component({
  selector: 'glint-test-knob-host',
  standalone: true,
  imports: [GlintKnobComponent, ReactiveFormsModule],
  template: `
    <glint-knob
      [min]="0"
      [max]="100"
      [step]="5"
      [size]="120"
      [formControl]="ctrl"
    />
  `,
})
class TestKnobHostComponent {
  ctrl = new FormControl(50);
}


describe('GlintKnobComponent', () => {
  describe('with FormControl', () => {
    beforeEach(() => {
      TestBed.configureTestingModule({ imports: [TestKnobHostComponent] });
    });

    it('should render SVG with correct size', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg).toBeTruthy();
      expect(svg.getAttribute('width')).toBe('120');
      expect(svg.getAttribute('height')).toBe('120');
    });

    it('should display value in center', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      const text = fixture.nativeElement.querySelector('.knob-text');
      expect(text).toBeTruthy();
      expect(text.textContent.trim()).toBe('50');
    });

    it('should work with FormControl (CVA)', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      const text = fixture.nativeElement.querySelector('.knob-text');
      expect(text.textContent.trim()).toBe('50');

      fixture.componentInstance.ctrl.setValue(75);
      fixture.detectChanges();
      expect(text.textContent.trim()).toBe('75');
    });

    it('should increase value on ArrowUp', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('svg');
      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      fixture.detectChanges();

      // step is 5, initial value 50 -> 55
      expect(fixture.componentInstance.ctrl.value).toBe(55);
    });

    it('should decrease value on ArrowDown', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('svg');
      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      fixture.detectChanges();

      // step is 5, initial value 50 -> 45
      expect(fixture.componentInstance.ctrl.value).toBe(45);
    });

    it('should clamp to min/max', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.componentInstance.ctrl.setValue(100);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('svg');
      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true }));
      fixture.detectChanges();

      expect(fixture.componentInstance.ctrl.value).toBe(100);

      fixture.componentInstance.ctrl.setValue(0);
      fixture.detectChanges();

      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown', bubbles: true }));
      fixture.detectChanges();

      expect(fixture.componentInstance.ctrl.value).toBe(0);
    });

    it('should have slider role with aria attributes', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('svg');
      expect(svg.getAttribute('role')).toBe('slider');
      expect(svg.getAttribute('aria-valuenow')).toBe('50');
      expect(svg.getAttribute('aria-valuemin')).toBe('0');
      expect(svg.getAttribute('aria-valuemax')).toBe('100');
    });

    it('should set disabled state from FormControl', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      fixture.componentInstance.ctrl.disable();
      fixture.detectChanges();

      const host = fixture.nativeElement.querySelector('glint-knob') as HTMLElement;
      expect(host.classList.contains('disabled')).toBe(true);
    });

    it('should respect step for keyboard changes', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.componentInstance.ctrl.setValue(50);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('svg');
      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
      fixture.detectChanges();

      // step is 5
      expect(fixture.componentInstance.ctrl.value).toBe(55);

      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }));
      fixture.detectChanges();

      expect(fixture.componentInstance.ctrl.value).toBe(50);
    });

    it('should set Home to min, End to max', () => {
      const fixture = TestBed.createComponent(TestKnobHostComponent);
      fixture.detectChanges();

      const svg = fixture.nativeElement.querySelector('svg');

      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'Home', bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.ctrl.value).toBe(0);

      svg.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true }));
      fixture.detectChanges();
      expect(fixture.componentInstance.ctrl.value).toBe(100);
    });
  });
});
