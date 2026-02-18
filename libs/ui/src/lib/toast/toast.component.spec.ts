import { TestBed } from '@angular/core/testing';
import { vi } from 'vitest';
import { GlintToastComponent } from './toast.component';
import { GlintToastService } from './toast.service';

describe('GlintToastService + GlintToastComponent', () => {
  let service: GlintToastService;

  beforeEach(() => {
    vi.useFakeTimers();
    TestBed.configureTestingModule({ imports: [GlintToastComponent] });
    service = TestBed.inject(GlintToastService);
  });

  afterEach(() => {
    service.clear();
    vi.useRealTimers();
  });

  it('should show a toast message', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    service.show({ severity: 'success', summary: 'Saved', duration: 0 });
    fixture.detectChanges();
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast).toBeTruthy();
    expect(toast.querySelector('.summary').textContent).toBe('Saved');
  });

  it('should show detail text', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    service.show({ severity: 'info', summary: 'Info', detail: 'More details here', duration: 0 });
    fixture.detectChanges();
    const detail = fixture.nativeElement.querySelector('.detail');
    expect(detail.textContent).toBe('More details here');
  });

  it('should auto-dismiss after duration', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    service.show({ severity: 'warning', summary: 'Warning', duration: 1000 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(1);
    vi.advanceTimersByTime(1000);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(0);
  });

  it('should dismiss on close button click', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    service.show({ severity: 'danger', summary: 'Error', duration: 0 });
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.close') as HTMLButtonElement;
    btn.click();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(0);
  });

  it('should show severity-based border', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    service.show({ severity: 'success', summary: 'OK', duration: 0 });
    fixture.detectChanges();
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.getAttribute('data-severity')).toBe('success');
  });

  it('should have aria-live="polite" on the host', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('aria-live')).toBe('polite');
  });

  it('should have role="alert" on individual toast items', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    service.show({ severity: 'info', summary: 'Test', duration: 0 });
    fixture.detectChanges();
    const toast = fixture.nativeElement.querySelector('.toast');
    expect(toast.getAttribute('role')).toBe('alert');
  });

  it('should have aria-atomic="false" to announce new toasts individually', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement as HTMLElement;
    expect(host.getAttribute('aria-atomic')).toBe('false');
  });

  it('should clear all toasts', () => {
    const fixture = TestBed.createComponent(GlintToastComponent);
    fixture.detectChanges();
    service.show({ severity: 'info', summary: 'A', duration: 0 });
    service.show({ severity: 'info', summary: 'B', duration: 0 });
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(2);
    service.clear();
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.toast').length).toBe(0);
  });
});
