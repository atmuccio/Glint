import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintCheckboxComponent } from './checkbox.component';
import { GlintStyleZoneComponent } from '../core/style-zone/style-zone.component';

@Component({
  selector: 'glint-test-checkbox-host',
  standalone: true,
  imports: [GlintCheckboxComponent, GlintStyleZoneComponent, ReactiveFormsModule],
  template: `
    <glint-style-zone>
      <glint-checkbox
        [disabled]="disabled"
        [indeterminate]="indeterminate"
        [formControl]="ctrl"
      >Check me</glint-checkbox>
    </glint-style-zone>
  `,
})
class TestCheckboxHostComponent {
  ctrl = new FormControl(false);
  disabled = false;
  indeterminate = false;
}

describe('GlintCheckboxComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestCheckboxHostComponent],
    });
  });

  it('should render unchecked by default', async () => {
    const fixture = TestBed.createComponent(TestCheckboxHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-checkbox') as HTMLElement;
    expect(host.classList.contains('checked')).toBe(false);
  });

  it('should toggle checked state on click', async () => {
    const fixture = TestBed.createComponent(TestCheckboxHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const box = fixture.nativeElement.querySelector('.box') as HTMLElement;
    box.click();
    fixture.detectChanges();

    const host = fixture.nativeElement.querySelector('glint-checkbox') as HTMLElement;
    expect(host.classList.contains('checked')).toBe(true);
    expect(fixture.componentInstance.ctrl.value).toBe(true);
  });

  it('should reflect FormControl value', async () => {
    const fixture = TestBed.createComponent(TestCheckboxHostComponent);
    fixture.componentInstance.ctrl.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-checkbox') as HTMLElement;
    expect(host.classList.contains('checked')).toBe(true);
  });

  it('should apply disabled state', async () => {
    const fixture = TestBed.createComponent(TestCheckboxHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-checkbox') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });

  it('should show indeterminate state', async () => {
    const fixture = TestBed.createComponent(TestCheckboxHostComponent);
    fixture.componentInstance.indeterminate = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-checkbox') as HTMLElement;
    expect(host.classList.contains('indeterminate')).toBe(true);

    const box = host.querySelector('.box') as HTMLElement;
    expect(box.getAttribute('aria-checked')).toBe('mixed');
  });

  it('should render label content', async () => {
    const fixture = TestBed.createComponent(TestCheckboxHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const label = fixture.nativeElement.querySelector('label') as HTMLElement;
    expect(label.textContent).toContain('Check me');
  });

  it('should disable via FormControl', async () => {
    const fixture = TestBed.createComponent(TestCheckboxHostComponent);
    fixture.componentInstance.ctrl.disable();
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-checkbox') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });
});
