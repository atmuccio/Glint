import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintToolbarComponent } from './toolbar.component';

@Component({
  selector: 'glint-test-toolbar-host',
  standalone: true,
  imports: [GlintToolbarComponent],
  template: `
    <glint-toolbar>
      <span glintToolbarStart>Start</span>
      <span glintToolbarCenter>Center</span>
      <span glintToolbarEnd>End</span>
    </glint-toolbar>
  `,
})
class TestToolbarHostComponent {}

describe('GlintToolbarComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestToolbarHostComponent] });
  });

  it('should have toolbar role', () => {
    const fixture = TestBed.createComponent(TestToolbarHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-toolbar') as HTMLElement;
    expect(el.getAttribute('role')).toBe('toolbar');
  });

  it('should project content into start slot', () => {
    const fixture = TestBed.createComponent(TestToolbarHostComponent);
    fixture.detectChanges();
    const start = fixture.nativeElement.querySelector('.start') as HTMLElement;
    expect(start.textContent?.trim()).toBe('Start');
  });

  it('should project content into center slot', () => {
    const fixture = TestBed.createComponent(TestToolbarHostComponent);
    fixture.detectChanges();
    const center = fixture.nativeElement.querySelector('.center') as HTMLElement;
    expect(center.textContent?.trim()).toBe('Center');
  });

  it('should project content into end slot', () => {
    const fixture = TestBed.createComponent(TestToolbarHostComponent);
    fixture.detectChanges();
    const end = fixture.nativeElement.querySelector('.end') as HTMLElement;
    expect(end.textContent?.trim()).toBe('End');
  });
});
