import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintFloatLabelComponent } from './float-label.component';

@Component({
  selector: 'glint-test-float-label-host',
  standalone: true,
  imports: [GlintFloatLabelComponent],
  template: `
    <glint-float-label>
      <input id="username" type="text" placeholder=" " />
      <label for="username">Username</label>
    </glint-float-label>
  `,
})
class TestFloatLabelHostComponent {}

describe('GlintFloatLabelComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestFloatLabelHostComponent] });
  });

  it('should render projected content', () => {
    const fixture = TestBed.createComponent(TestFloatLabelHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const input = el.querySelector('input');
    const label = el.querySelector('label');

    expect(input).toBeTruthy();
    expect(label).toBeTruthy();
    expect(label!.textContent).toContain('Username');
  });

  it('should have the wrapper class applied', () => {
    const fixture = TestBed.createComponent(TestFloatLabelHostComponent);
    fixture.detectChanges();
    const wrapper = fixture.nativeElement.querySelector('.glint-float-label-wrapper');
    expect(wrapper).toBeTruthy();
  });

  it('should have the host class', () => {
    const fixture = TestBed.createComponent(TestFloatLabelHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-float-label');
    expect(host.classList.contains('glint-float-label')).toBe(true);
  });
});
