import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintTimelineComponent, GlintTimelineEvent } from './timeline.component';

@Component({
  selector: 'glint-test-timeline-host',
  standalone: true,
  imports: [GlintTimelineComponent],
  template: `<glint-timeline [events]="events" />`,
})
class TestTimelineHostComponent {
  events: GlintTimelineEvent[] = [
    { title: 'Created', date: 'Jan 1', severity: 'info' },
    { title: 'In Progress', date: 'Jan 5', severity: 'warning', description: 'Working on it' },
    { title: 'Completed', date: 'Jan 10', severity: 'success' },
  ];
}

describe('GlintTimelineComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestTimelineHostComponent] });
  });

  it('should render all events', () => {
    const fixture = TestBed.createComponent(TestTimelineHostComponent);
    fixture.detectChanges();
    const events = fixture.nativeElement.querySelectorAll('.event');
    expect(events.length).toBe(3);
  });

  it('should render event titles', () => {
    const fixture = TestBed.createComponent(TestTimelineHostComponent);
    fixture.detectChanges();
    const titles = fixture.nativeElement.querySelectorAll('.title');
    expect(titles[0].textContent?.trim()).toBe('Created');
  });

  it('should render dates', () => {
    const fixture = TestBed.createComponent(TestTimelineHostComponent);
    fixture.detectChanges();
    const dates = fixture.nativeElement.querySelectorAll('.date');
    expect(dates[0].textContent?.trim()).toBe('Jan 1');
  });

  it('should render description when provided', () => {
    const fixture = TestBed.createComponent(TestTimelineHostComponent);
    fixture.detectChanges();
    const desc = fixture.nativeElement.querySelector('.description');
    expect(desc.textContent?.trim()).toBe('Working on it');
  });

  it('should apply severity class to marker', () => {
    const fixture = TestBed.createComponent(TestTimelineHostComponent);
    fixture.detectChanges();
    const markers = fixture.nativeElement.querySelectorAll('.marker');
    expect(markers[0].classList.contains('info')).toBe(true);
    expect(markers[2].classList.contains('success')).toBe(true);
  });

  it('should render connector lines between events', () => {
    const fixture = TestBed.createComponent(TestTimelineHostComponent);
    fixture.detectChanges();
    const lines = fixture.nativeElement.querySelectorAll('.line');
    expect(lines.length).toBe(2); // 3 events, 2 connectors
  });
});
