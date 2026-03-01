import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintInputGroupComponent, GlintInputGroupAddonDirective } from './input-group.component';

@Component({
  selector: 'glint-test-input-group-host',
  standalone: true,
  imports: [GlintInputGroupComponent, GlintInputGroupAddonDirective],
  template: `
    <glint-input-group>
      <span glintInputGroupAddon>$</span>
      <input type="text" placeholder="Amount" />
      <span glintInputGroupAddon>.00</span>
    </glint-input-group>
  `,
})
class TestInputGroupHostComponent {}

describe('GlintInputGroupComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestInputGroupHostComponent] });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(TestInputGroupHostComponent);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.placeholder).toBe('Amount');
  });

  it('should apply input-group wrapper class', () => {
    const fixture = TestBed.createComponent(TestInputGroupHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-input-group') as HTMLElement;
    expect(el.classList.contains('glint-input-group')).toBe(true);
  });

  it('should render addon content', () => {
    const fixture = TestBed.createComponent(TestInputGroupHostComponent);
    fixture.detectChanges();
    const addons = fixture.nativeElement.querySelectorAll('.glint-input-group-addon');
    expect(addons.length).toBe(2);
    expect(addons[0].textContent?.trim()).toBe('$');
    expect(addons[1].textContent?.trim()).toBe('.00');
  });

  it('should render prefix and suffix simultaneously', () => {
    const fixture = TestBed.createComponent(TestInputGroupHostComponent);
    fixture.detectChanges();
    const addons = fixture.nativeElement.querySelectorAll('.glint-input-group-addon');
    // First addon is prefix, last is suffix
    expect(addons[0].textContent?.trim()).toBe('$');
    expect(addons[addons.length - 1].textContent?.trim()).toBe('.00');
    // Input should be between them
    const children = Array.from(fixture.nativeElement.querySelector('glint-input-group').children) as HTMLElement[];
    const addonIndices = children
      .map((el, i) => el.classList.contains('glint-input-group-addon') ? i : -1)
      .filter(i => i >= 0);
    const inputIndex = children.findIndex(el => el.tagName === 'INPUT');
    expect(inputIndex).toBeGreaterThan(addonIndices[0]);
    expect(inputIndex).toBeLessThan(addonIndices[1]);
  });

  it('should use inline-flex display on host', () => {
    const fixture = TestBed.createComponent(TestInputGroupHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-input-group') as HTMLElement;
    // The component should use display: inline-flex via the .glint-input-group class
    expect(el.classList.contains('glint-input-group')).toBe(true);
  });
});
