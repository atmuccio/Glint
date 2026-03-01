import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintProgressBarComponent } from './progress-bar.component';

@Component({
  selector: 'glint-test-progress-host',
  standalone: true,
  imports: [GlintProgressBarComponent],
  template: `<glint-progress-bar [value]="value" [mode]="mode" [severity]="severity" />`,
})
class TestProgressBarHostComponent {
  value = 50;
  mode: 'determinate' | 'indeterminate' = 'determinate';
  severity: 'primary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';
}

describe('GlintProgressBarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestProgressBarHostComponent] });
  });

  it('should have progressbar role', () => {
    const fixture = TestBed.createComponent(TestProgressBarHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-progress-bar') as HTMLElement;
    expect(el.getAttribute('role')).toBe('progressbar');
  });

  it('should set aria-valuenow in determinate mode', () => {
    const fixture = TestBed.createComponent(TestProgressBarHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-progress-bar') as HTMLElement;
    expect(el.getAttribute('aria-valuenow')).toBe('50');
  });

  it('should set bar width to value percentage', () => {
    const fixture = TestBed.createComponent(TestProgressBarHostComponent);
    fixture.componentInstance.value = 75;
    fixture.detectChanges();
    const bar = fixture.nativeElement.querySelector('.bar') as HTMLElement;
    expect(bar.style.inlineSize).toBe('75%');
  });

  it('should not set aria-valuenow in indeterminate mode', () => {
    const fixture = TestBed.createComponent(TestProgressBarHostComponent);
    fixture.componentInstance.mode = 'indeterminate';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-progress-bar') as HTMLElement;
    expect(el.getAttribute('aria-valuenow')).toBeNull();
  });

  it('should apply severity attribute', () => {
    const fixture = TestBed.createComponent(TestProgressBarHostComponent);
    fixture.componentInstance.severity = 'success';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-progress-bar') as HTMLElement;
    expect(el.getAttribute('data-severity')).toBe('success');
  });
});
