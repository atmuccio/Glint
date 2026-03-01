import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintTagComponent } from './tag.component';

@Component({
  selector: 'glint-test-tag-host',
  standalone: true,
  imports: [GlintTagComponent],
  template: `
    <glint-tag
      [severity]="severity"
      [removable]="removable"
      [rounded]="rounded"
      (removed)="onRemoved()"
    >{{ text }}</glint-tag>
  `,
})
class TestTagHostComponent {
  severity: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'danger' = 'primary';
  removable = false;
  rounded = false;
  text = 'Feature';
  removed = false;
  onRemoved(): void { this.removed = true; }
}

describe('GlintTagComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestTagHostComponent] });
  });

  it('should render tag text', () => {
    const fixture = TestBed.createComponent(TestTagHostComponent);
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector('glint-tag') as HTMLElement;
    expect(tag.textContent?.trim()).toBe('Feature');
  });

  it('should set severity attribute', () => {
    const fixture = TestBed.createComponent(TestTagHostComponent);
    fixture.componentInstance.severity = 'success';
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector('glint-tag') as HTMLElement;
    expect(tag.getAttribute('data-severity')).toBe('success');
  });

  it('should show remove button when removable', () => {
    const fixture = TestBed.createComponent(TestTagHostComponent);
    fixture.componentInstance.removable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.remove') as HTMLElement;
    expect(btn).toBeTruthy();
  });

  it('should emit removed event', () => {
    const fixture = TestBed.createComponent(TestTagHostComponent);
    fixture.componentInstance.removable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.remove') as HTMLElement;
    btn.click();
    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('should hide remove button by default', () => {
    const fixture = TestBed.createComponent(TestTagHostComponent);
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.remove');
    expect(btn).toBeNull();
  });

  it('should apply rounded attribute', () => {
    const fixture = TestBed.createComponent(TestTagHostComponent);
    fixture.componentInstance.rounded = true;
    fixture.detectChanges();
    const tag = fixture.nativeElement.querySelector('glint-tag') as HTMLElement;
    expect(tag.hasAttribute('data-rounded')).toBe(true);
  });
});
