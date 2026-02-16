import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { GlintTableComponent, GlintSortEvent } from './table.component';
import { GlintColumnDirective } from './table-column.directive';

@Component({
  selector: 'glint-test-table-host',
  standalone: true,
  imports: [GlintTableComponent, GlintColumnDirective],
  template: `
    <glint-table [data]="data" [striped]="striped" (sortChange)="onSort($event)">
      <ng-template glintColumn="name" header="Name" [sortable]="true" let-row>
        {{ row['name'] }}
      </ng-template>
      <ng-template glintColumn="age" header="Age" [sortable]="true" let-row>
        {{ row['age'] }}
      </ng-template>
    </glint-table>
  `,
})
class TestTableHostComponent {
  data = [
    { name: 'Alice', age: 30 },
    { name: 'Bob', age: 25 },
    { name: 'Charlie', age: 35 },
  ];
  striped = false;
  lastSort: GlintSortEvent | null = null;
  onSort(event: GlintSortEvent): void {
    this.lastSort = event;
  }
}

describe('GlintTableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [TestTableHostComponent] });
  });

  it('should render column headers', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers.length).toBe(2);
    expect(headers[0].textContent).toContain('Name');
    expect(headers[1].textContent).toContain('Age');
  });

  it('should render data rows', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(3);
  });

  it('should render cell content', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('tbody td');
    expect(cells[0].textContent?.trim()).toBe('Alice');
  });

  it('should sort ascending on header click', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    headers[1].click(); // Sort by age
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('tbody tr td:nth-child(1)');
    expect(cells[0].textContent?.trim()).toBe('Bob'); // 25 first
  });

  it('should toggle sort direction on second click', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    headers[1].click(); // asc
    headers[1].click(); // desc
    fixture.detectChanges();
    const cells = fixture.nativeElement.querySelectorAll('tbody tr td:nth-child(1)');
    expect(cells[0].textContent?.trim()).toBe('Charlie'); // 35 first
  });

  it('should emit sortChange event', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    headers[0].click();
    fixture.detectChanges();
    expect(fixture.componentInstance.lastSort?.field).toBe('name');
    expect(fixture.componentInstance.lastSort?.order).toBe('asc');
  });

  it('should show empty message when no data', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.componentInstance.data = [];
    fixture.detectChanges();
    const empty = fixture.nativeElement.querySelector('.empty');
    expect(empty.textContent).toContain('No data available');
  });

  it('should have grid role', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const table = fixture.nativeElement.querySelector('table');
    expect(table.getAttribute('role')).toBe('grid');
  });
});
