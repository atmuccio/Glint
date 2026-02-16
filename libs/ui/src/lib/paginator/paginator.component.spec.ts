import { TestBed } from '@angular/core/testing';
import { Component, signal } from '@angular/core';
import { GlintPaginatorComponent, GlintPageEvent } from './paginator.component';

@Component({
  selector: 'glint-test-paginator-host',
  standalone: true,
  imports: [GlintPaginatorComponent],
  template: `
    <glint-paginator
      [totalRecords]="100"
      [(rows)]="rows"
      [(first)]="first"
      (pageChange)="onPageChange($event)"
    />
  `,
})
class TestPaginatorHostComponent {
  rows = signal(10);
  first = signal(0);
  lastEvent: GlintPageEvent | null = null;
  onPageChange(event: GlintPageEvent): void {
    this.lastEvent = event;
  }
}

describe('GlintPaginatorComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestPaginatorHostComponent] });
  });

  it('should render page buttons', () => {
    const fixture = TestBed.createComponent(TestPaginatorHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.page-btn');
    // First, Prev, 5 page buttons, Next, Last = 9
    expect(buttons.length).toBe(9);
  });

  it('should show page info text', () => {
    const fixture = TestBed.createComponent(TestPaginatorHostComponent);
    fixture.detectChanges();
    const info = fixture.nativeElement.querySelector('.info') as HTMLElement;
    expect(info.textContent).toContain('1–10 of 100');
  });

  it('should navigate to next page', () => {
    const fixture = TestBed.createComponent(TestPaginatorHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.page-btn');
    // Click page 2 button (index 3, after First/Prev buttons)
    buttons[3].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.first()).toBe(10);
  });

  it('should emit pageChange event', () => {
    const fixture = TestBed.createComponent(TestPaginatorHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.page-btn');
    buttons[3].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastEvent?.page).toBe(1);
    expect(fixture.componentInstance.lastEvent?.first).toBe(10);
  });

  it('should disable prev buttons on first page', () => {
    const fixture = TestBed.createComponent(TestPaginatorHostComponent);
    fixture.detectChanges();
    const buttons = fixture.nativeElement.querySelectorAll('.page-btn');
    expect(buttons[0].disabled).toBe(true); // First
    expect(buttons[1].disabled).toBe(true); // Prev
  });

  it('should have navigation role', () => {
    const fixture = TestBed.createComponent(TestPaginatorHostComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('glint-paginator');
    expect(el.getAttribute('role')).toBe('navigation');
  });
});
