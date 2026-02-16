import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintAvatarComponent } from './avatar.component';

@Component({
  selector: 'glint-test-avatar-host',
  standalone: true,
  imports: [GlintAvatarComponent],
  template: `<glint-avatar [label]="label" [image]="image" [size]="size" [shape]="shape" />`,
})
class TestAvatarHostComponent {
  label = 'John Doe';
  image = '';
  size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  shape: 'circle' | 'square' = 'circle';
}

describe('GlintAvatarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestAvatarHostComponent] });
  });

  it('should display initials from label', () => {
    const fixture = TestBed.createComponent(TestAvatarHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-avatar') as HTMLElement;
    expect(el.textContent?.trim()).toBe('JD');
  });

  it('should render image when provided', () => {
    const fixture = TestBed.createComponent(TestAvatarHostComponent);
    fixture.componentInstance.image = '/test.jpg';
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/test.jpg');
  });

  it('should apply size attribute', () => {
    const fixture = TestBed.createComponent(TestAvatarHostComponent);
    fixture.componentInstance.size = 'lg';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-avatar') as HTMLElement;
    expect(el.getAttribute('data-size')).toBe('lg');
  });

  it('should apply shape attribute', () => {
    const fixture = TestBed.createComponent(TestAvatarHostComponent);
    fixture.componentInstance.shape = 'square';
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-avatar') as HTMLElement;
    expect(el.getAttribute('data-shape')).toBe('square');
  });

  it('should have img role with aria-label', () => {
    const fixture = TestBed.createComponent(TestAvatarHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-avatar') as HTMLElement;
    expect(el.getAttribute('role')).toBe('img');
    expect(el.getAttribute('aria-label')).toBe('John Doe');
  });
});
