import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintMeterGroupComponent, GlintMeterItem } from './meter-group.component';

@Component({
  selector: 'glint-test-meter-group-host',
  standalone: true,
  imports: [GlintMeterGroupComponent],
  template: `
    <glint-meter-group
      [value]="items"
      [max]="max"
      [labelPosition]="labelPosition"
      [orientation]="orientation"
    />
  `,
})
class TestMeterGroupHostComponent {
  items: GlintMeterItem[] = [
    { label: 'Used', value: 40 },
    { label: 'Free', value: 30 },
    { label: 'System', value: 10, color: 'red' },
  ];
  max = 100;
  labelPosition: 'start' | 'end' = 'end';
  orientation: 'horizontal' | 'vertical' = 'horizontal';
}

describe('GlintMeterGroupComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestMeterGroupHostComponent] });
  });

  it('should render meter segments', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.detectChanges();
    const segments = fixture.nativeElement.querySelectorAll('.meter-segment');
    expect(segments.length).toBe(3);
  });

  it('should calculate segment widths based on value and max', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.detectChanges();
    const segments = fixture.nativeElement.querySelectorAll('.meter-segment') as NodeListOf<HTMLElement>;
    expect(segments[0].style.inlineSize).toBe('40%');
    expect(segments[1].style.inlineSize).toBe('30%');
    expect(segments[2].style.inlineSize).toBe('10%');
  });

  it('should render legend items', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.detectChanges();
    const labels = fixture.nativeElement.querySelectorAll('.legend-label');
    expect(labels.length).toBe(3);
    expect(labels[0].textContent?.trim()).toBe('Used');
    expect(labels[1].textContent?.trim()).toBe('Free');
    expect(labels[2].textContent?.trim()).toBe('System');
  });

  it('should use default colors when no color specified', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.detectChanges();
    const component = fixture.debugElement.children[0].componentInstance as GlintMeterGroupComponent;
    // Items without explicit color get default palette colors
    expect(component.itemColor(0)).toBe(component.defaultColors[0]);
    expect(component.itemColor(1)).toBe(component.defaultColors[1]);
    // Item with explicit color returns that color
    expect(component.itemColor(2)).toBe('red');
  });

  it('should have meter role and aria attributes', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.detectChanges();
    const meterBar = fixture.nativeElement.querySelector('.meter-bar') as HTMLElement;
    expect(meterBar.getAttribute('role')).toBe('meter');
    expect(meterBar.getAttribute('aria-valuemin')).toBe('0');
    expect(meterBar.getAttribute('aria-valuemax')).toBe('100');
    expect(meterBar.getAttribute('aria-valuenow')).toBe('80'); // 40 + 30 + 10
  });

  it('should render legend at start when labelPosition is start', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.componentInstance.labelPosition = 'start';
    fixture.detectChanges();
    const meterGroup = fixture.nativeElement.querySelector('.meter-group') as HTMLElement;
    const children = Array.from(meterGroup.children) as HTMLElement[];
    // Legend should come before the meter bar
    expect(children[0].classList.contains('legend')).toBe(true);
    expect(children[1].classList.contains('meter-bar')).toBe(true);
  });

  it('should render legend at end when labelPosition is end', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.componentInstance.labelPosition = 'end';
    fixture.detectChanges();
    const meterGroup = fixture.nativeElement.querySelector('.meter-group') as HTMLElement;
    const children = Array.from(meterGroup.children) as HTMLElement[];
    // Meter bar should come before the legend
    expect(children[0].classList.contains('meter-bar')).toBe(true);
    expect(children[1].classList.contains('legend')).toBe(true);
  });

  it('should set aria-label on each segment', () => {
    const fixture = TestBed.createComponent(TestMeterGroupHostComponent);
    fixture.detectChanges();
    const segments = fixture.nativeElement.querySelectorAll('.meter-segment') as NodeListOf<HTMLElement>;
    expect(segments[0].getAttribute('aria-label')).toBe('Used: 40');
    expect(segments[1].getAttribute('aria-label')).toBe('Free: 30');
    expect(segments[2].getAttribute('aria-label')).toBe('System: 10');
  });
});
