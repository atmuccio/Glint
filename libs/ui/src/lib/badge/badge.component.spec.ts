import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintBadgeComponent } from './badge.component';

@Component({
  selector: 'glint-test-badge-host',
  standalone: true,
  imports: [GlintBadgeComponent],
  template: `<glint-badge [severity]="severity" [size]="size">{{ text }}</glint-badge>`,
})
class TestBadgeHostComponent {
  severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';
  size: 'sm' | 'lg' = 'sm';
  text = '4';
}

describe('GlintBadgeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestBadgeHostComponent] });
  });

  it('should render badge text', () => {
    const fixture = TestBed.createComponent(TestBadgeHostComponent);
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('glint-badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('4');
  });

  it('should set severity attribute', () => {
    const fixture = TestBed.createComponent(TestBadgeHostComponent);
    fixture.componentInstance.severity = 'danger';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('glint-badge') as HTMLElement;
    expect(badge.getAttribute('data-severity')).toBe('danger');
  });

  it('should set size attribute', () => {
    const fixture = TestBed.createComponent(TestBadgeHostComponent);
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('glint-badge') as HTMLElement;
    expect(badge.getAttribute('data-size')).toBe('lg');
  });

  it('should render empty content gracefully', () => {
    const fixture = TestBed.createComponent(TestBadgeHostComponent);
    fixture.componentInstance.text = '';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('glint-badge') as HTMLElement;
    expect(badge).toBeTruthy();
    expect(badge.textContent?.trim()).toBe('');
  });

  it('should display large numbers', () => {
    const fixture = TestBed.createComponent(TestBadgeHostComponent);
    fixture.componentInstance.text = '999+';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('glint-badge') as HTMLElement;
    expect(badge.textContent?.trim()).toBe('999+');
  });
});
