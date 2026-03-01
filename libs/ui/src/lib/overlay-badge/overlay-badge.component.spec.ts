import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintOverlayBadgeComponent } from './overlay-badge.component';

@Component({
  selector: 'glint-test-overlay-badge-host',
  standalone: true,
  imports: [GlintOverlayBadgeComponent],
  template: `
    <glint-overlay-badge [value]="value" [severity]="severity" [size]="size">
      <button class="inner-btn">Notifications</button>
    </glint-overlay-badge>
  `,
})
class TestOverlayBadgeHostComponent {
  value: string | number = '';
  severity: 'primary' | 'success' | 'info' | 'warn' | 'danger' = 'primary';
  size: 'normal' | 'large' | 'xlarge' = 'normal';
}

describe('GlintOverlayBadgeComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestOverlayBadgeHostComponent] });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(TestOverlayBadgeHostComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.inner-btn');
    expect(btn).toBeTruthy();
    expect(btn.textContent).toContain('Notifications');
  });

  it('should render badge with value', () => {
    const fixture = TestBed.createComponent(TestOverlayBadgeHostComponent);
    fixture.componentInstance.value = '5';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.overlay-badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent?.trim()).toBe('5');
  });

  it('should not render badge when value is empty', () => {
    const fixture = TestBed.createComponent(TestOverlayBadgeHostComponent);
    fixture.componentInstance.value = '';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.overlay-badge');
    expect(badge).toBeNull();
  });

  it('should apply severity attribute', () => {
    const fixture = TestBed.createComponent(TestOverlayBadgeHostComponent);
    fixture.componentInstance.value = '3';
    fixture.componentInstance.severity = 'danger';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.overlay-badge') as HTMLElement;
    expect(badge.getAttribute('data-severity')).toBe('danger');
  });

  it('should apply size attribute', () => {
    const fixture = TestBed.createComponent(TestOverlayBadgeHostComponent);
    fixture.componentInstance.value = '3';
    fixture.componentInstance.size = 'large';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.overlay-badge') as HTMLElement;
    expect(badge.getAttribute('data-size')).toBe('large');
  });

  it('should position badge at top-right', () => {
    const fixture = TestBed.createComponent(TestOverlayBadgeHostComponent);
    fixture.componentInstance.value = '1';
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.overlay-badge') as HTMLElement;
    const styles = getComputedStyle(badge);
    expect(styles.position).toBe('absolute');
  });

  it('should display numeric values', () => {
    const fixture = TestBed.createComponent(TestOverlayBadgeHostComponent);
    fixture.componentInstance.value = 42;
    fixture.detectChanges();
    const badge = fixture.nativeElement.querySelector('.overlay-badge');
    expect(badge).toBeTruthy();
    expect(badge.textContent?.trim()).toBe('42');
  });
});
