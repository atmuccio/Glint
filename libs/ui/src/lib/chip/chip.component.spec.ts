import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintChipComponent } from './chip.component';

@Component({
  selector: 'glint-test-chip-host',
  standalone: true,
  imports: [GlintChipComponent],
  template: `
    <glint-chip [removable]="removable" [image]="image" (removed)="onRemoved()">{{ text }}</glint-chip>
  `,
})
class TestChipHostComponent {
  text = 'Angular';
  removable = false;
  image = '';
  removed = false;
  onRemoved(): void { this.removed = true; }
}

describe('GlintChipComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestChipHostComponent] });
  });

  it('should render chip text', () => {
    const fixture = TestBed.createComponent(TestChipHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-chip') as HTMLElement;
    expect(el.textContent).toContain('Angular');
  });

  it('should show remove button when removable', () => {
    const fixture = TestBed.createComponent(TestChipHostComponent);
    fixture.componentInstance.removable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.remove');
    expect(btn).toBeTruthy();
  });

  it('should emit removed event', () => {
    const fixture = TestBed.createComponent(TestChipHostComponent);
    fixture.componentInstance.removable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.remove') as HTMLButtonElement;
    btn.click();
    expect(fixture.componentInstance.removed).toBe(true);
  });

  it('should render image when provided', () => {
    const fixture = TestBed.createComponent(TestChipHostComponent);
    fixture.componentInstance.image = '/test.jpg';
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('.chip-image');
    expect(img).toBeTruthy();
  });

  it('should not show remove button when not removable', () => {
    const fixture = TestBed.createComponent(TestChipHostComponent);
    fixture.componentInstance.removable = false;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.remove');
    expect(btn).toBeFalsy();
  });

  it('should have aria-label on remove button', () => {
    const fixture = TestBed.createComponent(TestChipHostComponent);
    fixture.componentInstance.removable = true;
    fixture.detectChanges();
    const btn = fixture.nativeElement.querySelector('.remove') as HTMLElement;
    expect(btn.getAttribute('aria-label')).toBe('Remove');
  });
});
