import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintAccordionComponent } from './accordion.component';
import { GlintAccordionPanelComponent } from './accordion-panel.component';

@Component({
  selector: 'glint-test-accordion-host',
  standalone: true,
  imports: [GlintAccordionComponent, GlintAccordionPanelComponent],
  template: `
    <glint-accordion [multiple]="multiple">
      <glint-accordion-panel header="Section A">Content A</glint-accordion-panel>
      <glint-accordion-panel header="Section B">Content B</glint-accordion-panel>
      <glint-accordion-panel header="Section C" [disabled]="true">Content C</glint-accordion-panel>
    </glint-accordion>
  `,
})
class TestAccordionHostComponent {
  multiple = false;
}

describe('GlintAccordionComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestAccordionHostComponent] });
  });

  it('should render panel headers', () => {
    const fixture = TestBed.createComponent(TestAccordionHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.header');
    expect(headers.length).toBe(3);
    expect(headers[0].textContent).toContain('Section A');
  });

  it('should expand panel on click', () => {
    const fixture = TestBed.createComponent(TestAccordionHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.header');
    headers[0].click();
    fixture.detectChanges();
    const body = fixture.nativeElement.querySelector('[role="region"]');
    expect(body).toBeTruthy();
    expect(body.textContent?.trim()).toBe('Content A');
  });

  it('should collapse other panels in single mode', () => {
    const fixture = TestBed.createComponent(TestAccordionHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.header');
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    const bodies = fixture.nativeElement.querySelectorAll('[role="region"]');
    expect(bodies.length).toBe(1);
    expect(bodies[0].textContent?.trim()).toBe('Content B');
  });

  it('should allow multiple panels in multiple mode', () => {
    const fixture = TestBed.createComponent(TestAccordionHostComponent);
    fixture.componentInstance.multiple = true;
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.header');
    headers[0].click();
    fixture.detectChanges();
    headers[1].click();
    fixture.detectChanges();
    const bodies = fixture.nativeElement.querySelectorAll('[role="region"]');
    expect(bodies.length).toBe(2);
  });

  it('should not expand disabled panel', () => {
    const fixture = TestBed.createComponent(TestAccordionHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('.header');
    headers[2].click();
    fixture.detectChanges();
    const bodies = fixture.nativeElement.querySelectorAll('[role="region"]');
    expect(bodies.length).toBe(0);
  });

  it('should have correct ARIA attributes', () => {
    const fixture = TestBed.createComponent(TestAccordionHostComponent);
    fixture.detectChanges();
    const header = fixture.nativeElement.querySelector('.header');
    expect(header.getAttribute('aria-expanded')).toBe('false');
    header.click();
    fixture.detectChanges();
    expect(header.getAttribute('aria-expanded')).toBe('true');
  });
});
