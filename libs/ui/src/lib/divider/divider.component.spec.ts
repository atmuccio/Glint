import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintDividerComponent } from './divider.component';

@Component({
  selector: 'glint-test-divider-host',
  standalone: true,
  imports: [GlintDividerComponent],
  template: `<glint-divider [orientation]="orientation" [label]="label" />`,
})
class TestDividerHostComponent {
  orientation: 'horizontal' | 'vertical' = 'horizontal';
  label = '';
}

describe('GlintDividerComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestDividerHostComponent] });
  });

  it('should render horizontal divider by default', () => {
    const fixture = TestBed.createComponent(TestDividerHostComponent);
    fixture.detectChanges();
    const divider = fixture.nativeElement.querySelector('glint-divider') as HTMLElement;
    expect(divider.getAttribute('role')).toBe('separator');
    expect(divider.getAttribute('data-orientation')).toBe('horizontal');
    expect(divider.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('should render vertical divider', () => {
    const fixture = TestBed.createComponent(TestDividerHostComponent);
    fixture.componentInstance.orientation = 'vertical';
    fixture.detectChanges();
    const divider = fixture.nativeElement.querySelector('glint-divider') as HTMLElement;
    expect(divider.getAttribute('data-orientation')).toBe('vertical');
  });

  it('should show label when provided', () => {
    const fixture = TestBed.createComponent(TestDividerHostComponent);
    fixture.componentInstance.label = 'OR';
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.label') as HTMLElement;
    expect(label.textContent?.trim()).toBe('OR');
  });

  it('should hide label when empty', () => {
    const fixture = TestBed.createComponent(TestDividerHostComponent);
    fixture.detectChanges();
    const label = fixture.nativeElement.querySelector('.label');
    expect(label).toBeNull();
  });

  it('should render two line elements when label is present', () => {
    const fixture = TestBed.createComponent(TestDividerHostComponent);
    fixture.componentInstance.label = 'Section';
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.line');
    expect(lines.length).toBe(2);
  });
});
