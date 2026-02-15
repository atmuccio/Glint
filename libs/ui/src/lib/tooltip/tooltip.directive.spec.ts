import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { OverlayModule } from '@angular/cdk/overlay';
import { GlintTooltipDirective } from './tooltip.directive';

@Component({
  selector: 'glint-test-tooltip-host',
  standalone: true,
  imports: [GlintTooltipDirective],
  template: `
    <button
      [glintTooltip]="message"
      [glintTooltipDisabled]="disabled"
    >Hover me</button>
  `,
})
class TestTooltipHostComponent {
  message = 'Test tooltip';
  disabled = false;
}

describe('GlintTooltipDirective', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestTooltipHostComponent, OverlayModule],
    });
  });

  it('should show tooltip on mouseenter', async () => {
    const fixture = TestBed.createComponent(TestTooltipHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    button.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();

    const tooltip = document.querySelector('glint-tooltip-panel') as HTMLElement;
    expect(tooltip).toBeTruthy();
    expect(tooltip.textContent).toBe('Test tooltip');
  });

  it('should hide tooltip on mouseleave', async () => {
    const fixture = TestBed.createComponent(TestTooltipHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    button.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-tooltip-panel')).toBeTruthy();

    button.dispatchEvent(new Event('mouseleave'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-tooltip-panel')).toBeFalsy();
  });

  it('should set aria-describedby on host', async () => {
    const fixture = TestBed.createComponent(TestTooltipHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    expect(button.getAttribute('aria-describedby')).toMatch(/^glint-tooltip-\d+$/);
  });

  it('should not show when disabled', async () => {
    const fixture = TestBed.createComponent(TestTooltipHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    button.dispatchEvent(new Event('mouseenter'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-tooltip-panel')).toBeFalsy();
  });

  it('should show on focus and hide on blur', async () => {
    const fixture = TestBed.createComponent(TestTooltipHostComponent);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLElement;
    button.dispatchEvent(new Event('focus'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-tooltip-panel')).toBeTruthy();

    button.dispatchEvent(new Event('blur'));
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.querySelector('glint-tooltip-panel')).toBeFalsy();
  });
});
