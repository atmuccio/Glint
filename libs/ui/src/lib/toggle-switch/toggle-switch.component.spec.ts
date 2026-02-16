import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GlintToggleSwitchComponent } from './toggle-switch.component';
import { GlintStyleZoneComponent } from '../core/style-zone/style-zone.component';

@Component({
  selector: 'glint-test-toggle-host',
  standalone: true,
  imports: [GlintToggleSwitchComponent, GlintStyleZoneComponent, ReactiveFormsModule],
  template: `
    <glint-style-zone>
      <glint-toggle-switch [formControl]="ctrl" [disabled]="disabled">Dark mode</glint-toggle-switch>
    </glint-style-zone>
  `,
})
class TestToggleHostComponent {
  ctrl = new FormControl(false);
  disabled = false;
}

describe('GlintToggleSwitchComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TestToggleHostComponent],
    });
  });

  it('should render unchecked by default', async () => {
    const fixture = TestBed.createComponent(TestToggleHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-toggle-switch') as HTMLElement;
    expect(host.classList.contains('checked')).toBe(false);
  });

  it('should toggle on click', async () => {
    const fixture = TestBed.createComponent(TestToggleHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const track = fixture.nativeElement.querySelector('.track') as HTMLElement;
    track.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.ctrl.value).toBe(true);
    const host = fixture.nativeElement.querySelector('glint-toggle-switch') as HTMLElement;
    expect(host.classList.contains('checked')).toBe(true);
  });

  it('should reflect FormControl value', async () => {
    const fixture = TestBed.createComponent(TestToggleHostComponent);
    fixture.componentInstance.ctrl.setValue(true);
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-toggle-switch') as HTMLElement;
    expect(host.classList.contains('checked')).toBe(true);
  });

  it('should have role=switch', async () => {
    const fixture = TestBed.createComponent(TestToggleHostComponent);
    fixture.detectChanges();
    await fixture.whenStable();

    const track = fixture.nativeElement.querySelector('.track') as HTMLElement;
    expect(track.getAttribute('role')).toBe('switch');
    expect(track.getAttribute('aria-checked')).toBe('false');
  });

  it('should apply disabled state', async () => {
    const fixture = TestBed.createComponent(TestToggleHostComponent);
    fixture.componentInstance.disabled = true;
    fixture.detectChanges();
    await fixture.whenStable();

    const host = fixture.nativeElement.querySelector('glint-toggle-switch') as HTMLElement;
    expect(host.classList.contains('disabled')).toBe(true);
  });
});
