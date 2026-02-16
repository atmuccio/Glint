import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintFieldsetComponent } from './fieldset.component';

@Component({
  selector: 'glint-test-fieldset-host',
  standalone: true,
  imports: [GlintFieldsetComponent],
  template: `
    <glint-fieldset legend="Details" [toggleable]="toggleable" [(collapsed)]="collapsed">
      <p>Content here</p>
    </glint-fieldset>
  `,
})
class TestFieldsetHostComponent {
  toggleable = false;
  collapsed = signal(false);
}

describe('GlintFieldsetComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestFieldsetHostComponent] });
  });

  it('should render legend text', () => {
    const fixture = TestBed.createComponent(TestFieldsetHostComponent);
    fixture.detectChanges();
    const legend = fixture.nativeElement.querySelector('legend');
    expect(legend.textContent).toContain('Details');
  });

  it('should render content by default', () => {
    const fixture = TestBed.createComponent(TestFieldsetHostComponent);
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.content');
    expect(content).toBeTruthy();
    expect(content.textContent).toContain('Content here');
  });

  it('should show toggle button when toggleable', () => {
    const fixture = TestBed.createComponent(TestFieldsetHostComponent);
    fixture.componentInstance.toggleable = true;
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.toggle');
    expect(toggle).toBeTruthy();
  });

  it('should collapse on toggle click', () => {
    const fixture = TestBed.createComponent(TestFieldsetHostComponent);
    fixture.componentInstance.toggleable = true;
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.content');
    expect(content).toBeNull();
  });

  it('should expand on second toggle click', () => {
    const fixture = TestBed.createComponent(TestFieldsetHostComponent);
    fixture.componentInstance.toggleable = true;
    fixture.detectChanges();
    const toggle = fixture.nativeElement.querySelector('.toggle') as HTMLButtonElement;
    toggle.click();
    fixture.detectChanges();
    toggle.click();
    fixture.detectChanges();
    const content = fixture.nativeElement.querySelector('.content');
    expect(content).toBeTruthy();
  });
});
