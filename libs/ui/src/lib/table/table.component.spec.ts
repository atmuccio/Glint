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

@Component({
  selector: 'glint-test-table-fixed-layout',
  standalone: true,
  imports: [GlintTableComponent, GlintColumnDirective],
  template: `
    <glint-table [data]="data" [fixedLayout]="true" trackBy="id">
      <ng-template glintColumn="id" header="ID" let-row>
        {{ row['id'] }}
      </ng-template>
      <ng-template glintColumn="name" header="Name" let-row>
        {{ row['name'] }}
      </ng-template>
    </glint-table>
  `,
})
class TestTableFixedLayoutHostComponent {
  data = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];
}

@Component({
  selector: 'glint-test-table-column-features',
  standalone: true,
  imports: [GlintTableComponent, GlintColumnDirective],
  template: `
    <glint-table [data]="data">
      <ng-template glintColumn="id" header="ID" [sticky]="true" let-row>
        {{ row['id'] }}
      </ng-template>
      <ng-template glintColumn="name" header="Name" align="center" let-row>
        {{ row['name'] }}
      </ng-template>
      <ng-template glintColumn="actions" header="Actions" [stickyEnd]="true" align="end" let-row>
        Edit
      </ng-template>
    </glint-table>
  `,
})
class TestTableColumnFeaturesHostComponent {
  data = [
    { id: 1, name: 'Alice', actions: '' },
    { id: 2, name: 'Bob', actions: '' },
  ];
}

describe('GlintTableComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        TestTableHostComponent,
        TestTableFixedLayoutHostComponent,
        TestTableColumnFeaturesHostComponent,
      ],
    });
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

  // --- fixedLayout tests ---

  it('should apply data-fixed-layout attribute when fixedLayout is true', () => {
    const fixture = TestBed.createComponent(TestTableFixedLayoutHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-table');
    expect(host.hasAttribute('data-fixed-layout')).toBe(true);
  });

  it('should not apply data-fixed-layout attribute by default', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('glint-table');
    expect(host.hasAttribute('data-fixed-layout')).toBe(false);
  });

  // --- trackBy tests ---

  it('should render correctly with trackBy field', () => {
    const fixture = TestBed.createComponent(TestTableFixedLayoutHostComponent);
    fixture.detectChanges();
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');
    expect(rows.length).toBe(2);
    const cells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(cells[0].textContent?.trim()).toBe('1');
    expect(cells[1].textContent?.trim()).toBe('Alice');
  });

  // --- sticky column tests ---

  it('should apply sticky-start class on sticky column header and cells', () => {
    const fixture = TestBed.createComponent(TestTableColumnFeaturesHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers[0].classList.contains('sticky-start')).toBe(true);
    expect(headers[1].classList.contains('sticky-start')).toBe(false);

    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells[0].classList.contains('sticky-start')).toBe(true);
    expect(firstRowCells[1].classList.contains('sticky-start')).toBe(false);
  });

  it('should apply sticky-end class on stickyEnd column header and cells', () => {
    const fixture = TestBed.createComponent(TestTableColumnFeaturesHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers[2].classList.contains('sticky-end')).toBe(true);
    expect(headers[0].classList.contains('sticky-end')).toBe(false);

    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells[2].classList.contains('sticky-end')).toBe(true);
    expect(firstRowCells[0].classList.contains('sticky-end')).toBe(false);
  });

  // --- column alignment tests ---

  it('should apply align-center class on center-aligned column', () => {
    const fixture = TestBed.createComponent(TestTableColumnFeaturesHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers[1].classList.contains('align-center')).toBe(true);
    expect(headers[0].classList.contains('align-center')).toBe(false);

    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells[1].classList.contains('align-center')).toBe(true);
  });

  it('should apply align-end class on end-aligned column', () => {
    const fixture = TestBed.createComponent(TestTableColumnFeaturesHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    expect(headers[2].classList.contains('align-end')).toBe(true);

    const firstRowCells = fixture.nativeElement.querySelectorAll('tbody tr:first-child td');
    expect(firstRowCells[2].classList.contains('align-end')).toBe(true);
  });

  it('should not apply alignment classes on default-aligned column', () => {
    const fixture = TestBed.createComponent(TestTableColumnFeaturesHostComponent);
    fixture.detectChanges();
    const headers = fixture.nativeElement.querySelectorAll('th');
    // First column has default align='start', should have no alignment classes
    expect(headers[0].classList.contains('align-center')).toBe(false);
    expect(headers[0].classList.contains('align-end')).toBe(false);
  });

  // --- sort does not mutate input data ---

  it('should not mutate the original data array when sorting', () => {
    const fixture = TestBed.createComponent(TestTableHostComponent);
    fixture.detectChanges();
    const originalOrder = [...fixture.componentInstance.data];
    const headers = fixture.nativeElement.querySelectorAll('th');
    headers[1].click(); // Sort by age
    fixture.detectChanges();
    // Original data should remain in the same order
    expect(fixture.componentInstance.data).toEqual(originalOrder);
  });
});
